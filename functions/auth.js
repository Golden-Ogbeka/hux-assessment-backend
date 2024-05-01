const jwt = require('jsonwebtoken');
const UserModel = require('../api/v1/models/user.model');

const getUserDetails = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData = jwt.verify(authorization, process.env.JWT_SECRET || '');

  if (!tokenData) throw new Error(tokenData);

  const adminDetails = await UserModel.findOne({
    email: tokenData?.email,
  });

  if (!adminDetails) throw new Error('Unauthorized!');

  return adminDetails;
};

const getTokenData = (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData = jwt.verify(authorization, process.env.JWT_SECRET || '');

  return tokenData || null;
};

module.exports = {
  getTokenData,
  getUserDetails,
};
