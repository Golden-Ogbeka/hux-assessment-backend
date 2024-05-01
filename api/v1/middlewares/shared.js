const { ObjectId } = require('mongodb');

const isValidAPI = async (value) => {
  const API_KEY = process.env.API_KEY;
  if (API_KEY !== value) {
    throw new Error('Invalid API key');
  }

  return true;
};

const isValidObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID');
  }
  return true;
};

module.exports = {
  isValidAPI,
  isValidObjectId,
};
