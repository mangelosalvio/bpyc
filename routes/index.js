const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var express = require('express');
var router = express.Router();
const Log = require('../models/Log')
const User = require('../models/User')

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		return res.redirect('/login');
    //return next(err);
  }
}


/* GET home page. */
router.get('/', requiresLogin ,function(req, res, next) {
	res.redirect('/residents');
});

/**
 * Get Login Page
 */
router.post('/login', [
		check('username')
			.isLength({ min : 1 }).withMessage('Username is required'),
		check('password')
			.isLength({ min : 1 }).withMessage('Password is required'),
	] ,function(req, res, next) {
		var user = new User({
			username : req.body.username
		});

		const errors = validationResult(req);

		if ( !errors.isEmpty() ) {
			res.status(401);
			res.render('login', { user, errors : errors.mapped() });
		} else {
			/**
			 * Check login of User here
			 */
			User.authenticate(req.body.username, req.body.password, (error, user) => {
				if ( error || !user ) {
					var err = new Error("Wrong email or password");
					err.status = 401;



					res.render('login', { user, errors : {
						password : {
							msg : 'Invalid email or password'
						}
					} });
				} else {
					req.session.userId = user._id;
					return res.redirect('/residents');
				}
				
			});
		}
});

router.get('/login', function(req, res, next) {

	var msg = {
		success_message : req.flash('success_message')
	}

	return res.render('login', { errors : {}, msg })
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
	if (req.session) {
	  // delete session object
	  req.session.destroy(function (err) {
		if (err) {
		  return next(err);
		} else {
		  return res.redirect('/');
		}
	  });
	}
  });


module.exports = router;
