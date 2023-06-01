
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const User = require('../models/userModel');
// const auth = require('../middleware/userAuth');
const ServerError = require('../utils/ErrorInterface');
const ApiFeatures = require('../utils/apiFeatures');
const sendToken = require("../utils/jwtToken");
const Product = require('../models/product');
// const { sendgridApiKey, sendgridEmail } = config

const signup = async (req, res, next) => {
  try {
    // get user data from request
    const { name, phone, password, email } = req.body;
    // check if user's data exist
    if (!name || !phone || !password)
      return next(ServerError.badRequest(400, 'enter all fields'));
    // check if password is correct
    // if (password !== confirmPassword)
    //   return next(ServerError.badRequest(400, 'password not match'));
    // create new user
    let user;
    if (email) {
      user = new User({
        name,
        email,
        phone,
        password
      });
    }
    if (!email) {
      user = new User({
        name,
        phone,
        password
      });
    }


    // save user in database
    await user.save();
    sendToken(user, 201, res);
  } catch (e) {
    console.log(e)
    e.statusCode = 400
    next(e)
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    console.log(username, password)
    if (!username || !password)
      return next(ServerError.badRequest(400, 'username and password are required'));
    const user = await User.Login(username, password);
    // send response to user;
    sendToken(user, 200, res);
  } catch (e) {
    e.statusCode = 401;
    next(e);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const notAllowedUpdates = ['status', 'tokens', 'image', 'balance', 'password', 'updatedAt', '_id', 'createdAt', 'resetLink',];
    const inValidUpdates = updates.filter(el => notAllowedUpdates.includes(el))
    if (inValidUpdates.length > 0) {
      return next(ServerError.badRequest(401, `not allowed to update (${inValidUpdates.join(', ')})`))
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    await user.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: user,
    })
  } catch (e) {
    next(e)
  }
};


const getUserInfo = async (req, res, next) => {
  try {
    const user = { ...req.user._doc };
    delete user.tokens
    delete user.password
    delete user.resetLink
    if (!user) {
      return next(ServerError.badRequest(401, "token is not valid"));
    }
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: user
    })
  } catch (e) {
    next(e);
  }
}

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

const changePassword = async (req, res, next) => {
  try {
    if (!req.user)
      return next(ServerError.badRequest(400, "token is not valid"));
    const user = req.user;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    if (password === newPassword)
      return next(ServerError.badRequest(400, "old and new password are same"));
    const isMatched = await user.validatePassword(password);
    if (!isMatched)
      return next(ServerError.badRequest(400, "wrong password"));
    user.password = newPassword;
    await user.save()
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'password has been updated successfully',
    })
  } catch (e) {
    // next(ServerError.badRequest(500, e.message))
    next(e)
    // res.status.apply(500).send(e.message);
  }
};


// const resetPassword = async (req, res, next) => {
//   try {
//     const resetLink = req.params.token
//     const newPassword = req.body.password
//     if (!newPassword) {
//       return next(ServerError.badRequest(401, 'please send password'))
//     }
//     if (resetLink) {
//       jwt.verify(resetLink, 'resetPassword', async function (err, decoded) {
//         if (err) {
//           return next(ServerError.badRequest(401, 'token is not correct'))
//         }
//         const user = await User.findOne({ resetLink: resetLink })
//         if (!user) {
//           return next(ServerError.badRequest(401, 'token is not correct'))
//         }
//         await user.updateOne({ password: newPassword }, {
//           new: true,
//           runValidators: true,
//         }, async (err, data) => {
//           if (err) {
//             return next(ServerError.badRequest(401, e.message))
//           }
//           else if (data) {
//             console.log(user.password)
//             console.log()
//             user.password = newPassword;
//             user.resetLink = ''
//             await user.save()
//             res.json(
//               {
//                 ok: true,
//                 code: 200,
//                 message: 'succeeded',
//                 data: 'your password is successfully changed'
//               }
//             )
//           }
//         })
//       })
//     }
//     else {
//       return next(ServerError.badRequest(401, 'Authentication error!'))
//     }
//   } catch (e) {
//     // e.statusCode = 400
//     next(e)
//     // next(ServerError.badRequest(500, e.message))
//     // res.status(500).send(e.message)
//   }
// }


// const forgetPassword = async (req, res, next) => {
//   try {
//     const email = req.body.email
//     const url = 'http://localhost:3000'
//     const user = User.findOne({ email }, (err, user) => {
//       if (err || !user) {
//         // return res.status(404).send('user with this email dose not exist')
//         return next(ServerError.badRequest(400, 'no user found with this email'))
//       }
//       const token = jwt.sign({ _id: user._id }, 'resetPassword', { expiresIn: '20m' })
//       // const SENDGRID_API_KEY = "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"
//       // const SENDGRID_API_KEY = "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"
//       sendgrid.setApiKey(sendgridApiKey)
//       const data = {
//         to: email,
//         from: sendgridEmail,
//         subject: 'Account reset password Link',
//         html: ` <h2>Please click on given Link to reset your password</h2>  
//                     <p> ${url}/api/v1/users/auth/reset-password/${token} </p> 
//               `
//       }
//       user.updateOne({ resetLink: token }, function (err, success) {
//         if (err) {
//           return next(ServerError.badRequest(400, 'something went wrong'))
//           // return res.status(400).json({ err: 'reset password link error' })
//         }
//         else {
//           sendgrid.send(data)
//             .then((response) => {
//               res.status(200).json({
//                 ok: true,
//                 code: 200,
//                 message: 'succeeded',
//                 body: 'email has been sent',
//               })
//             })
//             .catch((err) => {
//               return next(ServerError.badRequest(400, err.message))
//               // res.json(error.message)
//             })
//         }
//       })
//     })
//   }
//   catch (e) {
//     // e.statusCode = 400
//     next(e)
//     // next(ServerError.badRequest(500, e.message))
//     // res.status(500).send(e.message)
//   }
// }


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
      domain: '.bestprice4deals.com',
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
const logoutAll = async (req, res, next) => {
  try {
    console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    // e.statusCode = 400
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // console.log(e);
    // res.status(500).send(e);
  }
};



const addUser = async (req, res) => {
  try {
    const data = req.body;
    const sql = `INSERT INTO tabCustomer SET idx = ?,id = ?,name = ?,customer_name = ?,email_id = ?,mobile_no = ?, customer_primary_contact = ? ,language = ?,territory = ? ,customer_group = ?,customer_type = ?,owner = ?,modified_by = ?;`

    // const user = db.query(sql,[
    //   data.id,
    //   data.id,
    //   `${data.fName} ${data.lName}_${Date.now()}`,
    //   `${data.fName} ${data.lName}`,
    //   data.email,
    //   data.phone,
    //   'en',
    //   'All Territories',
    //   'All Customer Groups',
    //   'Individual',
    //   'admin@hatlystore.com',
    //   'admin@hatlystore.com',
    //   Date(),
    //   Date(),
    // ], (err,result)=>{
    //   if(err)
    //     console.log(err)
    //   res.status(201).json(
    //     {
    //       ok:true,
    //       status : 201,
    //       data : result
    //     }
    //   )
    // })
    const user = db.query(sql, [
      data.id,
      data.id,
      `${data.fName} ${data.lName}_${Date.now()}`,
      `${data.fName} ${data.lName}`,
      data.email,
      data.phone,
      data.phone,
      'en',
      'All Territories',
      'All Customer Groups',
      'Individual',
      'admin@hatlystore.com',
      'admin@hatlystore.com',
      // Date(),
      // Date(),
    ], (err, result) => {
      if (err)
        console.log(err)
      res.status(201).json(
        {
          ok: true,
          status: 201,
          data: result
        }
      )
    })
  } catch (e) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: e.message
    })
  }
}
const getStats = async (req, res) => {
  try {
    const products = await Product.countDocuments({ owner: req.user._id });
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: {
        products,
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  addUser,
  signup,
  login,
  logout,
  getUserInfo,
  updateUser,
  auth,
  getStats
}