const bcrypt = require('bcryptjs');
const { getPaginationOptions } = require('../../../utils/pagination');
const { validationResult } = require('express-validator');
const UserModel = require('../models/user.model');
const { getDateFilters } = require('../../../functions/filters');
const { sendEmail } = require('../../../utils/mailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Controller = () => {
  // Login an User into their Account
  const Login = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password } = req.body;

      // find user
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser)
        return res.status(400).json({ message: 'Invalid email or password' });

      // compare passwords
      bcrypt.compare(password, existingUser.password, function (err, matched) {
        if (!matched)
          return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT Token
        jwt.sign(
          existingUser.toJSON(),
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '2d' },
          (err, token) => {
            return res.status(200).json({
              message: 'Login successful',
              user: existingUser,
              token,
            });
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const Register = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password, fullName } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ email });
      if (existingUser && Object.keys(existingUser).length)
        return res.status(400).json({ message: 'User already exists' });

      // Hash password
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        //Store new user
        let newUser = await UserModel.create({
          email,
          password: hash,
          fullName,
        });

        return res.status(200).json({
          message: 'Registration successful',
          user: newUser,
        });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Request Password Reset
  const ResetPasswordRequest = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ email });
      if (!existingUser)
        return res.status(404).json({ message: 'User not found' });

      const verificationCode = crypto.randomUUID().substring(0, 5);

      existingUser.verificationCode = verificationCode;

      existingUser.save();

      const emailToSend = {
        body: {
          greeting: 'Dear',
          name: existingUser?.fullName,
          intro:
            'You have received this email because a password reset request for your account was received.',
          action: {
            instructions: `Click the button below to reset your password or use <b>${verificationCode}</b> as your verification code :`,
            button: {
              color: '#DC4D2F',
              text: 'Reset password',
              fallback: true,
              link: `${
                process.env.WEBSITE_URL || ''
              }/auth/reset-password/?email=${
                existingUser?.email
              }&verificationCode=${verificationCode}`,
            },
          },
          signature: 'Regards',
          outro:
            'If you did not request a password reset, no further action is required on your part.',
        },
      };

      sendEmail(email, 'Reset Password', emailToSend);

      return res.status(200).json({
        message: 'Reset password request successful',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ResetPasswordUpdate = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, newPassword, verificationCode } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ email, verificationCode });

      // Hash password
      bcrypt.hash(newPassword, 8, async function (err, hash) {
        if (!existingUser)
          return res
            .status(400)
            .json({ message: 'Invalid email or verification code' });

        const verificationCode = crypto.randomUUID().substring(0, 5);

        existingUser.password = hash;
        existingUser.verificationCode = verificationCode; //resetting the verification code also
        existingUser.save();

        const emailToSend = {
          body: {
            greeting: 'Dear',
            name: existingUser?.fullName,
            intro: 'You have successfully reset your password',
            signature: 'Regards',
            outro:
              'If you did not request a password reset, please contact Admin.',
          },
        };

        sendEmail(email, 'Reset password update', emailToSend);

        return res.status(200).json({
          message: 'Password updated successfully',
        });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    Login,
    Register,
    ResetPasswordRequest,
    ResetPasswordUpdate,
  };
};

module.exports = Controller;
