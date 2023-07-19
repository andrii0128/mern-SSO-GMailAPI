const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');

// @route    POST api/google
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    console.log(name, " : ", email);
    try {
        let user = await User.findOne({ email} );

        if (user) {
            return res
                .status(400)
                .json({ errors : [{msg: 'User already exists '}]});
        }

        user = new User({
            name,
            email,
            tokens: {
                accessToken : null,
                refreshToken : null
            }
        });

        await user.save();

        const payload = {
            user: {
            id: user.id
            }
        };

        console.log("payload : ", payload);

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                console.log("token : ", token);
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
  }
);

router.post(
    '/login',
    check('email', 'Please include a valid email').isEmail(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email } = req.body;
  
      console.log("email : ", email);
      try {
          let user = await User.findOne({ email} );
  
          if (!user) {
              return res
                  .status(400)
                  .json({ errors : [{msg: 'User does not exist. Please sign up first!'}]});
          }
  
          const payload = {
              user: {
              id: user.id
              }
          };
  
          console.log("payload : ", payload);
  
          jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: '5 days' },
              (err, token) => {
                  if (err) throw err;
                  console.log("token : ", token);
                  res.json({ token });
              }
          );
      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
    }
  );

module.exports = router;
