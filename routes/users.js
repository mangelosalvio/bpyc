const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var express = require('express');
var router = express.Router();
const User = require('../models/User')

router.get('/register', function(req, res, next) {
  res.render('register',{ errors : {} });
});

router.post('/', [
  check('username')
    .isLength({ min : 1 }).withMessage('Username is required'),
  check('password')
    .isLength({ min : 1 }).withMessage('Password is required'),
  check('confirm_password')
    .isLength({ min : 1 }).withMessage('Confirm Password is required')
    .custom( (value, {req}) => value === req.body.password ).withMessage('Password confirmation must have the save value as the password field'),
] ,(req, res, next) => {
  const errors = validationResult(req); 

  var user = new User({
    password : req.body.password,
    confirm_password : req.body.confirm_password,
    username : req.body.username
  });
  
  if ( !errors.isEmpty() ) {
    res.status(401);
    res.render('register', { user ,errors : errors.mapped() });
  } 

  User.create(user, (err, user) => {
    if ( err ) {
      return next(err);
    } else {
      req.flash('success_message','User registered successfully');
      return res.redirect('/');
    }
  });
  
})

module.exports = router;
