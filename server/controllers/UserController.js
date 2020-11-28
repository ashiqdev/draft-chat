const mongoose = require('mongoose');
const sha256 = require('js-sha256');
const User = mongoose.model('User');
const jwt = require('jwt-then');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (user) throw 'User already exists';

  if (password.length < 6) throw 'Passwords must be at least 6 characters long';

  const newUser = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
  });

  await newUser.save();

  res.json({
    message: `User registered successfully`,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw 'Email and Password did not match';

  const token = await jwt.sign({ id: user.id }, process.env.SECRET);

  res.json({
    message: 'User logged in Successfully!',
    token,
  });
};
