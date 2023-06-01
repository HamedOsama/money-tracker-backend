const ServerError = require("../utils/ErrorInterface");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/admin");

exports.authUser = async (req, res, next, role = 'user') => {
  try {
    const { access_token: token } = req.cookies;
    if (!token) {
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (role === 'user') {
      user = await User.findOne({ _id: decodedData.id, tokens: token , status: 1 });
    } else if (role === 'admin') {
      user = await Admin.findOne({ _id: decodedData.id, tokens: token });
    }
    if (!user) {
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }

    req.user = user;
    next();
  }
  catch (e) {
    e.statusCode = 401;
    next(e);
  }
};
exports.authUserAsUser = async (req, res, next) => {
  await exports.authUser(req, res, next, 'user');
};

exports.authUserAsAdmin = async (req, res, next) => {
  await exports.authUser(req, res, next, 'admin');
};