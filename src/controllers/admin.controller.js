const { customAlphabet } = require('nanoid');

const ServerError = require("../utils/ErrorInterface");
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const Product = require('../models/product');
const Order = require('../models/order');
const sendToken = require('../utils/jwtToken');
const Admin = require('../models/admin');


const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 12);

//auth
const signup = async (req, res, next) => {
  try {
    // get admin data from request
    const { password, email } = req.body;
    // check if admin's data exist
    if (!email || !password)
      return next(ServerError.badRequest(400, 'enter all fields'));
    // create new admin
    const admin = new Admin({
      email,
      password
    });
    // save admin in database
    await admin.save();
    sendToken(admin, 201, res);
  } catch (e) {
    console.log(e)
    e.statusCode = 400
    next(e)
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password)
      return next(ServerError.badRequest(400, 'Email and password are required'));
    const admin = await Admin.Login(email, password);
    // send response to admin;
    sendToken(admin, 200, res);
  } catch (e) {
    e.statusCode = 401;
    next(e);
  }
};
const logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el != req.cookies.access_token;
    });
    await req.user.save();
    res.status(200).clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      path: '/',
      domain: '.kit-hardware-center.com',
      sameSite: 'none',
    }).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e)
  }
};
const auth = async (req, res, next) => {
  try {
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e)
  }
}
//stats
const getStats = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: {
        users,
      }
    })
  } catch (e) {
    next(e)
  }
}

// user
const addUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username,
      password,
    })
    await user.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: user
    })
  } catch (e) {
    next(e);
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const usersQuery = new APIFeatures(User.find(), req?.query).filter().sort().limitFields().paginate();
    const lengthQuery = User.countDocuments();

    const [users, totalLength] = await Promise.all([usersQuery.query, lengthQuery]);
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: users,
      totalLength
    })
  } catch (e) {
    next(e);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const user = await User.findById(id);
    if (!user) {
      return next(ServerError.badRequest(404, 'user not found'))
    }
    const { username, password, status,activeProductsLimit } = req.body;
    if (username)
      user.username = username;
    if (password)
      user.password = password;
    if (status)
      user.status = status;
    if (activeProductsLimit)
      user.activeProductsLimit = activeProductsLimit;
    await user.save();
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: user
    })
  } catch (e) {
    next(e);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(ServerError.badRequest(404, 'user not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e);
  }
};


module.exports = {
  signup,
  login,
  auth,
  logout,
  getStats,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
};