const ContactModel = require('../models/contact.model');

const doesContactExist = async (phoneNumber) => {
  const isValidContact = await ContactModel.findOne({
    phoneNumber,
  });

  if (isValidContact) throw new Error('Contact already exists!');

  return true;
};

module.exports = {
  doesContactExist,
};
