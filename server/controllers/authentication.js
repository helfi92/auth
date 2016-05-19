const User = require('../models/user');
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
				success: true
			});
		});

	});
	
}