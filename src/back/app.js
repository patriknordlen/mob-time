let express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

// Setup server express
const path = require("path");
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routing').start(app);
require('./sockets').setup(io);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
