const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'), err => {
		if (err) res.status(500).send(err);
	});
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`express server running on port ${port}`));
