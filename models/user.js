const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  template: { type: String, lowercase: true }
});

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // override user password with generated hash
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(attempt, cb) {
  bcrypt.compare(attempt, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
}

// create instance
const User = mongoose.model('user', userSchema);

// export instance
module.exports = User;
