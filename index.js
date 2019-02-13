var express = require('express');
var app = require('./app.js');
var port = 3000;


var server = express();
server.use(app.router);
server.listen(port, () => console.log(`jwt-express app listening on port ${port}!`));