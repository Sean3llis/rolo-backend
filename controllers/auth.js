const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.getUser = function(req, res, next) {
  const username = req.params.username
  const user = User.findOne({ username: username }, (err, user) => {
    if (err) return next(err);
    res.json({ user });
  });
};

exports.signin = function(req, res, next) {
  res.send({
    token: tokenForUser(req.user),
    user: req.user
  });
};

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
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

      res.json({ token: tokenForUser(user), user: user});
    });
  });
};

exports.update = function(req, res, next) {
  console.log('============================================================');
  const userData = req.body.data;
  console.log('userData ~~>', userData);
  if (!userData) next();
  User.findById(req.params.id, (err, user) => {
    user.name = userData.name;
    user.projects = userData.projects;
    user.blurb = userData.blurb;
    user.color = userData.color;
    user.save(err => {
      if (err) { return next(err) }
      res.status(200).send('success');
    })
  })
};
