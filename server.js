var path = require('path');
var express = require('express');
var cors = require('cors');

var CLIENT_DIR = path.join(__dirname, 'client');
var PORT = process.env.PORT || 3000;
var app = express();

app.use(cors());

if (process.env.NODE_ENV === 'production') {
	//Serving the files on the CLIENT folder
	app.use(express.static(CLIENT_DIR));
	app.use((req, res, next) => {
		if (req.header('x-forwarded-proto') !== 'https') {
			res.redirect(`https://${req.header('host')}${req.url}`);
		} else {
			next();
		}
	});
}

//Send index.html when the user access the web
app.get('*', function(req, res) {
	res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

app.listen(PORT);
