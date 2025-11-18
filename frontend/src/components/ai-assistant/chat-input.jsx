import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';

const ChatInput = ({ onSendMessage, disabled = false }) => {
	const [text, setText] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmed = text.trim();
		if (!trimmed) return;
		onSendMessage(trimmed);
		setText('');
	};

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
			<div className="flex items-center gap-3">
				<Input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={disabled ? 'Assistant is thinking...' : 'Type a message...'}
					disabled={disabled}
					className="flex-1"
				/>
				<Button type="submit" disabled={disabled || text.trim() === ''}>
					Send
				</Button>
			</div>
		</form>
	);
};

export default ChatInput;
