const { getUserDetails } = require('../../../functions/auth');
const { validationResult } = require('express-validator');
const ContactModel = require('../models/contact.model');

const Controller = () => {
  const GetContacts = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all contacts

      const contactsData = await ContactModel.find().sort({ name: 1 });

      return res.status(200).json({
        message: 'All Contacts Retrieved',
        data: contactsData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewContact = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find contact

      const contactData = await ContactModel.findById(id);

      if (!contactData)
        return res.status(404).json({ message: 'Contact not found' });

      return res.status(200).json({
        message: 'Contact retrieved successfully',
        contact: contactData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddContact = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { firstName, lastName, phoneNumber } = req.body;

      const contactData = new ContactModel({
        firstName,
        lastName,
        phoneNumber,
      });
      await contactData.save();

      return res.status(200).json({
        message: 'Contact added',
        contact: contactData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const UpdateContact = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { firstName, lastName, phoneNumber } = req.body;

      const { id } = req.params;

      const userDetails = await getUserDetails(req);

      // Check if Contact exists
      const existingContact = await ContactModel.findById(id);

      if (!existingContact)
        return res.status(404).json({ message: 'Contact not found' });

      existingContact.firstName = firstName;
      existingContact.lastName = lastName;
      existingContact.phoneNumber = phoneNumber;

      await existingContact.save();

      return res.status(200).json({
        message: 'Contact updated successfully',
        contact: existingContact,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const DeleteContact = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find contact

      const contactData = await ContactModel.findById(id);

      if (!contactData)
        return res.status(404).json({ message: 'Contact not found' });

      await ContactModel.findByIdAndDelete(id);

      return res.status(200).json({
        message: 'Contact deleted Successfully',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetContacts,
    AddContact,
    ViewContact,
    UpdateContact,
    DeleteContact,
  };
};

module.exports = Controller;
