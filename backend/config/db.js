import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || '';
    // Log masked original MONGO_URI for debugging (don't reveal credentials)
    try {
      const maskedOrig = uri.replace(/(mongodb\+srv:\/\/)(.*?)(@)/, '$1<credentials>$3');
      // eslint-disable-next-line no-console
      console.log('[db] original MONGO_URI:', maskedOrig);
    } catch (e) {}

    // If the connection string does not include a database name, append a default one.
    // This helps when users paste the Atlas URI without a database (e.g. ends with '/').
    if (!/\/[^/?]+(\?|$)/.test(uri)) {
      if (!uri) throw new Error('MONGO_URI is not set');
      if (uri.includes('?')) {
        const [base, query] = uri.split('?');
        uri = `${base}/productivityhub?${query}`;
      } else {
        uri = uri.replace(/\/?$/, '/productivityhub');
      }
      // eslint-disable-next-line no-console
      console.log('[db] No DB name in MONGO_URI — defaulting to `productivityhub`.');
    }

    // Log a masked version of the final URI to aid debugging (hide credentials)
    try {
      const masked = uri.replace(/(mongodb\+srv:\/\/)(.*?)(@)/, '$1<credentials>$3');
      // eslint-disable-next-line no-console
      console.log('[db] connecting to:', masked);
    } catch (e) {
      // ignore masking errors
    }

    const conn = await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Provide clearer error message for invalid namespace/connect issues
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};
