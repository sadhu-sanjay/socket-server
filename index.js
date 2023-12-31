import cors from 'cors';
import express from 'express';

const app = express();
const port = 8080;

app.use(cors());

const clients = {};

app.get('/events', (req, res) => {
	const clientId = Date.now();
	console.log(`Client ${clientId} connected`);

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');

	clients[clientId] = res;

	req.on('close', () => {
		console.log(`Client ${clientId} disconnected`);
		delete clients[clientId];
	})
})

function sendToClients(event, data) {
	Object.keys(clients).forEach((clientId) => {
		clients[clientId].write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
	});
}

// send a random number every 2 seconds to the client 
// send this number to all the clients connected to the server

function startSendingRandomNumbers() {
	setInterval(() => {
		const randomNumber = Math.floor(Math.random() * (7000 - 700 + 1) + 700);
		console.log(`Sending ${randomNumber}`);
		sendToClients('ping', randomNumber);
	}, 4000);
}


app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	startSendingRandomNumbers();
})

