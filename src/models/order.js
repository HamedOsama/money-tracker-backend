const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const validator = require('validator')
const  User  = require('./userModel')
const Product = require('./product')
const orderSchema = mongoose.Schema({
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    id: {
        type : String,
        required : true,
        unique : true,
    },
    orderItems: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: Product,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value, ['ar-EG'])) {
                throw new Error('Phone number is invalid')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        default: '',
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    region: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    building: {
        type: String,
        trim: true,
        default: ''
    },
    floor: {
        type: String,
        trim: true,
        default: ''
    },
    apartment: {
        type: String,
        trim: true,
        default: ''
    },
    shipping: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        default: 0,
        required: true
    },
    subtotal : {
        type: Number,
        default: 0,
        required: true
    },
    orderState: {
        type: Number,
        default: 0
    },
    deliveredAt: {
        type: Date
    }
})
orderSchema.plugin(timestamps)


orderSchema.pre(/^find/, function (next) {
    this.populate('buyer').populate({
        path: 'orderItems',
        populate: {
            path: 'product'
        }
    });
    next();
});


const Order = mongoose.model('orders', orderSchema)
module.exports = Order