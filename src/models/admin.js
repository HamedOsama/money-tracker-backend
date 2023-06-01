const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      // let strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
      if (value.length < 8)
        throw new Error("password length must be at least 8")
      // if (!strongPass.test(value))
      // throw new Error("password must contain at least one capital/small letter & special characters and number")
    }
  },
  tokens: [{
    type: String,
    required: true
  }],
  resetLink: {
    type: String,
    default: ''
  }
}, { timestamps: true })

adminSchema.pre('save', async function () {
  const admin = this
  if (admin.isModified('password'))
    admin.password = await bcryptjs.hash(admin.password, 8)
})

adminSchema.statics.Login = async function (email, pass) {
  const admin = await Admin.findOne({ email })
  if (!admin)
    throw new Error('Email is not found!');
  const isMatch = await bcryptjs.compare(pass, admin.password)
  if (!isMatch)
    throw new Error('Password is wrong!')
  return admin
}
adminSchema.methods.generateJWTToken = async function () {
  const admin = this
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
  admin.tokens = admin.tokens.concat(token)
  await admin.save()
  return token
}
adminSchema.methods.validatePassword = async function (password) {
  const admin = this
  const isMatch = await bcryptjs.compare(password, admin.password)
  return isMatch;
}
// Generating Password Reset Token
adminSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to adminSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
adminSchema.methods.toJSON = function () {
  const admin = this
  const adminObj = admin.toObject()
  delete adminObj.password;
  // delete adminObj.tokens;
  return adminObj

}
const Admin = mongoose.model('admins', adminSchema)
module.exports = Admin;