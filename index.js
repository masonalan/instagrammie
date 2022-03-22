const express = require('express');

const path = require('path');

const ig = require('./instagram.js')

const app = express();
const expressWs = require('express-ws')(app);

// Config for Puppeteer
const port = 3000;
const isLoggedIn = false;

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.ws('/comments', function (ws, req) {
	ws.on('message', function(url) {
		(async() => {
			ws.send('logging into burner ig account...');
			let page = await ig.getSession()

			ws.send(`scraping comments at ${url}...`);
			let comments = await ig.streamComments(url, (count, delta) => {
				ws.send(`found ${delta} more comments (${count} total)...`);
			});

			ws.send(`total comments: ${comments.length}`);
			ws.send('building statistics...');
			
		})();
		console.log(url);
	});
});

app.listen(port);

