const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    verificationCode: { type: String, required: false },
  },
  { timestamps: true }
);

// Hide Password and verification code in responses
userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.verificationCode;
  return obj;
};

userSchema.plugin(mongoosePaginate);

const UserModel = model('User', userSchema);

module.exports = UserModel;
