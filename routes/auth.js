const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

///Get logged in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//////////////LOGIN A USER
router.post(
  '/',
  [
    check('email', 'please provide a valid email').isEmail(),
    check('password', 'password can only have minimum 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          msg: 'Invalid credentials',
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: 'Invalid credentials',
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error!');
    }
  }
);

module.exports = router;
