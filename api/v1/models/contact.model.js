const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

contactSchema.plugin(mongoosePaginate);

const ContactModel = model('Contact', contactSchema);

module.exports = ContactModel;
