const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Number,
    default: 1,
    enum: [0, 1],
  },
  activeProductsLimit: {
    type: Number,
    default: 100,
    required: true,
    min: 1,
  },
  telegramToken: {
    type: String,
    trim: true,
  },
  telegramChatId: {
    type: [String],
    trim: true,
    maxlength: 3
  },
  tokens: [{
    type: String,
    required: true
  }],
  resetLink: {
    type: String,
    default: ''
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
userSchema.plugin(timestamps)

// userSchema.virtual('buyerOrders', {
//     ref: 'orders',
//     localField: '_id',
//     foreignField: 'buyerId'
// })
// userSchema.virtual('sellerOrders', {
//     ref: 'orders',
//     localField: '_id',
//     foreignField: 'sellerId'
// })

userSchema.pre('save', async function () {
  console.log('pre save')
  const user = this
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8)
    console.log('entered')
  }
})

userSchema.statics.Login = async function (username, pass) {
  const user = await User.findOne({ username })
  console.log(user)
  if (!user)
    throw new Error('Username is not found!');
  const isMatch = await bcryptjs.compare(pass, user.password)
  if (!isMatch)
    throw new Error('Password is wrong!')
  if (user.status !== 1)
    throw new Error('not authorized you are blocked')
  return user
}
userSchema.methods.generateJWTToken = async function () {
  const user = this
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat(token)
  await user.save()
  return token
}
userSchema.methods.validatePassword = async function (password) {
  const user = this
  const isMatch = await bcryptjs.compare(password, user.password)
  return isMatch;
}
// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password;
  // delete userObj.tokens;
  return userObj

}
const User = mongoose.model('users', userSchema)
module.exports = User;