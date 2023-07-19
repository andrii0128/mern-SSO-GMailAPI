const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { google } = require("googleapis");
const User = require('../../models/User');

require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI

);

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
];

router.get('/', auth, async (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
            prompt: "consent",
        });
        res.json(url);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

router.post(
    '/',
    check('authorizationCode', 'authorizationCode is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { authorizationCode, email } = req.body;
        console.log("authorizationCode : ", authorizationCode);

        const { tokens } = await oauth2Client.getToken(authorizationCode);
        accessToken = tokens.access_token;
        refreshToken = tokens.refresh_token;
        User.findOneAndUpdate(
            { email: email },
            { tokens: {accessToken, refreshToken} },
            { new: true },
            (err, updatedUser) => {
              if (err) {
                console.error(err);
              } else {
                res.json("success");
              }
            }
          );
        // console.log(tokens);
        // oauth2Client.setCredentials(tokens);
      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
    }
  );

module.exports = router;