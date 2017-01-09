const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Signing up user (${username})/(${password})`);
  // basic validation
  if (!username || !password) {
    return res.status(422).send({ error: 'username and password are required'});
  }

  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err); }

    // username is already taken
    if (existingUser) {
      return res.status(422).send({error:'username in use'});
    }

    // create and save
    const user = new User({
      username: username,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      res.json({ token: tokenForUser(user)});
    });
  });
};
