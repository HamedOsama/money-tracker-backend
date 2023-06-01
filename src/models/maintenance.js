const mongoose = require('mongoose');
const { Schema , model} = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const maintenanceSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
    trim: true,
    default : 0
  },
  deviceName : {
    type: String,
    trim: true,
  },
  model : {
    type: String,
    trim: true,
  },
  serialNumber : {
    type: String,
    trim: true,
  },
  problem : {
    type: String,
    trim: true,
  },
  cost : {
    type: String,
    trim: true,
    default : '0'
  },
  notes : {
    type: String,
    trim: true,
  },
},{ timestamps: true  , _id: false});


maintenanceSchema.plugin(AutoIncrement);

const Maintenance = model('maintenances', maintenanceSchema);
module.exports = Maintenance;