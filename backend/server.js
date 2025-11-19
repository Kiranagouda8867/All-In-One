import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import habitRoutes from "./routes/habitRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import path from "path";
import fs from "fs";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists and serve it statically
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.use("/api/habits", habitRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/sessions", sessionRoutes);

// Server-Sent Events endpoint for sessions real-time updates
app.locals.sseClients = [];
app.get('/api/sessions/stream', (req, res) => {
	// set headers for SSE
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders && res.flushHeaders();

	const clientId = Date.now();
	const newClient = { id: clientId, res };
	app.locals.sseClients.push(newClient);

	// send a comment to keep connection alive
	res.write(': connected\n\n');

	req.on('close', () => {
		app.locals.sseClients = app.locals.sseClients.filter(c => c.id !== clientId);
	});
});

// broadcaster helper
app.locals.broadcastSessions = (payload) => {
	const data = `data: ${JSON.stringify(payload)}\n\n`;
	app.locals.sseClients.forEach(c => {
		try { c.res.write(data); } catch (e) { /* ignore write errors */ }
	});
};

// Log incoming requests for sessions for debugging
app.use('/api/sessions', (req, res, next) => {
	console.log(`[sessions] ${req.method} ${req.originalUrl}`);
	next();
});

// Dump registered routes (helpful to check PUT/DELETE presence)
const listRoutes = () => {
	try {
		console.log('Registered Express routes:');
		const router = app._router;
		if (!router || !Array.isArray(router.stack)) {
			console.log('(no routes registered or router stack unavailable)');
			return;
		}

		router.stack.forEach((layer) => {
			try {
				if (layer.route && layer.route.path) {
					const methods = Object.keys(layer.route.methods || {}).map(m => m.toUpperCase()).join(',');
					console.log(`${methods} ${layer.route.path}`);
					return;
				}

				// Some layers are routers with an internal stack
				const handle = layer.handle || layer;
				const innerStack = (handle && (handle.stack || handle._router && handle._router.stack)) || [];
				if (Array.isArray(innerStack)) {
					innerStack.forEach((l) => {
						if (l && l.route && l.route.path) {
							const methods = Object.keys(l.route.methods || {}).map(m => m.toUpperCase()).join(',');
							console.log(`${methods} ${l.route.path}`);
						}
					});
				}
			} catch (e) {
				// ignore per-layer errors
			}
		});
	} catch (err) {
		console.error('Could not list routes', err);
	}
};

listRoutes();

app.listen(5000, () => console.log("Server running on port 5000"));
