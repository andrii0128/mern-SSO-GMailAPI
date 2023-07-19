const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { google } = require("googleapis");
const Email = require('../../models/Email');

require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI

);

function getBodyContent(parts) {
  for (const part of parts) {
    if (part.parts) {
      // Recursive call for nested parts
      return getBodyContent(part.parts);
    } else {
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        return Buffer.from(part.body.data, 'base64').toString();
      }
    }
  }
  return '';
}

router.post(
    '/',
    check('accessToken', 'accessToken is required').notEmpty(),
    check('refreshToken', 'refreshToken is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { accessToken, refreshToken, user_email } = req.body;
        
        oauth2Client.setCredentials({
            access_token : accessToken,
            refresh_token : refreshToken
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        try {
          const response = await gmail.users.messages.list({
            userId: 'me', // 'me' refers to the authenticated user
            maxResults: 2, // Set the number of emails to retrieve
          });
          let index = 1;
          const emails = response.data.messages;
          if (emails && emails.length) {
            let email_list = [];
            let email_db = [];
            for (const email of emails) {
              console.log(index);
              const message = await gmail.users.messages.get({
                userId: 'me',
                id: email.id,
                format: 'full', // Retrieve the complete email payload
              });
              const emailData = message.data;
              let from = emailData.payload.headers.find(h => h.name === 'From').value;
              let to = emailData.payload.headers.find(h => h.name === 'To').value;
              let date = new Date(emailData.payload.headers.find(h => h.name === 'Date').value);
              let subject = emailData.payload.headers.find(h => h.name === 'Subject').value;
              let body = getBodyContent(emailData.payload.parts).replace(/\n{2,}/g, '\n');
              email_list.push({from, to, date, subject, body});
              email_db.push({email:user_email, from, to, date, subject, body});
              index = index + 1;
            }
            Email.deleteMany({ email: user_email }, function(err) {
              if (err) {
                console.error(err);
              } else {
                Email.insertMany(email_db, function(err, docs) {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(docs.length + ' documents saved successfully.');
                  }
                });
              }
            });
            res.json(email_list);
          } else {
            console.log('No emails found.');
          }
        } catch (error) {
          console.error('Error retrieving emails:', error);
        }

      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
    }
  );

  router.post(
    '/load',
    check('email', 'email is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { email } = req.body;
        const emails = await Email.find({ email });
        res.json(emails);

      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
    }
  );

  module.exports = router;