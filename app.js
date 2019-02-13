var express = require('express');
var bodyParser = require('body-parser');
var utils = require('./utils');

var router = express.Router()

router.use(bodyParser.json());
router.use(utils.validateTokenMiddleware);

router.post('/login', function(req, res) {
	if ((req.body) && (req.body.login === 'foo') && (req.body.password === 'bar')) {
		var token = utils.generateToken({ login: req.body.login });
		res.status(200).json({ message: "Auth passed", token: token });
	} else {
		res.status(400).json({ message: "Invalid credentials" });
	}
});

router.get('/protected', function(req, res) {
	res.status(200).send({ message: 'This is protected resource!' });
})

module.exports = { router: router };