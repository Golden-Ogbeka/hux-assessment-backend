const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const isValidUser = async (value) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists and is activated
    const isValidUser = await UserModel.findOne({
      email: tokenData?.email,
      active: true,
    });

    if (!isValidUser) throw 'Unauthorized! Contact Admin';

    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};

module.exports = {
  isValidUser,
};
