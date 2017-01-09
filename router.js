const AuthController = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send(req.user);
  });
  app.get('/:username', AuthController.getUser);
  app.patch('/users/:id', requireAuth, AuthController.update);

  app.post('/signin', requireSignIn, AuthController.signin);
  app.post('/signup', AuthController.signup);
};
