import cors from 'cors';
import express from 'express';
import { executeQuery } from './config/db.js';
import { log } from 'console';
import { PORT } from './config/config.js';

const app = express();
const port = PORT

app.use(cors());

const clients = {};

app.get('/sse', (req, res) => {
	const clientId = Date.now();
	console.log(`Client ${clientId} connected`);

	res.setHeader('Content-Type', 'text/event-stream');
	// res.setHeader('Cache-Control', 'no-cache');

	clients[clientId] = res;

	req.on('close', () => {
		console.log(`Client ${clientId} disconnected`);
		delete clients[clientId];
	})
})


function sendToClients(data) {
	Object.keys(clients).forEach((clientId) => {
		clients[clientId].write(`data: ${JSON.stringify(data)}\n\n`);
	});
}

// send a random number every 2 seconds to the client 
// send this number to all the clients connected to the server
app.get('/ping', (req, res) => {
	console.log(`SendingHello `);
	sendToClients('ping', "Hello")
	res.status(200).send('OK');
})

app.get('/sample', (req, res) => {
	const query = `SELECT Title, Tags, Region, City, City, Country , lat, lng, RecordKey FROM Records LIMIT 100;`
	executeQuery(query)
		.then((data) => {
			res.status(200).json(data);
		}).catch((rsn) => {
			log("Error", rsn)
			res.status(500).json({ error: rsn })
		})
})


function startSendingRandomNumbers() {
	setInterval(() => {
		const randomNumber = Math.floor(Math.random() * (7000 - 700 + 1) + 700);
		console.log(`Sending ${randomNumber}`);
		sendToClients(randomNumber);
	}, 5000);
}


app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	startSendingRandomNumbers();
})

