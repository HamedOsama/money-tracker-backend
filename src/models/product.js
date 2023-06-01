const mongoose = require('mongoose')
const User = require('./userModel')

const productSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        maxLength: [8, "Price cannot exceed 8 characters"],
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
    },
}, { timestamps: true })
const Product = mongoose.model('products', productSchema)
module.exports = Product