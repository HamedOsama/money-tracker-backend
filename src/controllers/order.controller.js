const { customAlphabet } = require('nanoid');
const ServerError = require("../utils/ErrorInterface");
const Order = require('../models/order');
const APIFeatures = require('../utils/apiFeatures');

const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 12);

const addOrder = async (req, res, next) => {
  try {
    const { city, region, address, building, floor, apartment, products, shipping, vat } = req.body;

    const subtotal = products.reduce((acc, el) => acc + (el.sellPrice * el.quantity), 0);
    const total = subtotal + shipping + vat
    const orderItems = products.map(el => {
      return {
        product: el._id,
        quantity: el.quantity
      }
    })
    console.log(subtotal);
    console.log(total);
    console.log(orderItems)

    const order = new Order({
      ...req.body,
      buyer: req.user._id,
      name : req?.user?.name,
      email : req?.user?.email,
      phone : req?.user?.phone,
      subtotal,
      total,
      orderItems,
      id: nanoid()
    })
    await order.save();
    res.status(201).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: order
    })
  } catch (e) {
    next(e)
  }
}
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});

    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      data: orders,
    })
  } catch (e) {
    next(e);
  }
}

const getUserOrders = async (req, res, next) => {
  try {
    const ordersQuery = new APIFeatures(Order.find({ buyer: req.user._id }, 'id orderItems total createdAt orderState'), req?.query).sort();
    const orders = await ordersQuery.query;
    const totalLength = await Order.find({ buyer: req.user._id }).countDocuments();
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: orders,
      totalLength
    })
  } catch (e) {
    next(e);
  }
}

const getOrder = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(ServerError.badRequest(401, 'order id is required'));
    }
    const order = await Order.findOne({ id: req.params.id, buyer: req.user._id });
    if (!order) {
      return next(ServerError.badRequest(401, 'order not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: order
    })
  } catch (e) {
    next(e);
  }
}

module.exports = { addOrder, getUserOrders, getAllOrders, getOrder }