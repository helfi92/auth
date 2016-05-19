const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	//	User has already had their email and password auth'd 
	//	We just need to give them a token
	res.send( { token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
	console.log('body: ', req.body);
	const email = req.body.email;
	const password = req.body.password;

	//	See if a user with the given email exists
	User.findOne({email: email}, function(err, user){
		if (err) { return next(err); }

		if(user) {
			return res.status(422).send({error: 'Email is in use'});
		}

		const newUser = new User(req.body);
		newUser.save(function(err) {
			if (err) { return next(err); }
			res.json({
				token: tokenForUser(newUser)
			});
		});

	});
	
}