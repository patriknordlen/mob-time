let express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

require('./routing').start(app);
require('./sockets').setup(io);


// Setup server express
const path = require("path");
app.use(express.static('src/front'));
app.set('views', path.join(__dirname, '../front'));
app.set('view engine', 'pug');

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server started on http://0.0.0.0:${PORT}`));
