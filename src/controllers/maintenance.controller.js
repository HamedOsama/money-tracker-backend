const ServerError = require("../utils/ErrorInterface");
const Maintenance = require('../models/maintenance');
const APIFeatures = require('../utils/apiFeatures');

const getAllMaintenances = async (req, res, next) => {
  try {
    const maintenancesQuery = new APIFeatures(Maintenance.find({ phone: req.user.phone }), req?.query).sort();
    const totalLengthQuery = Maintenance.find({ phone: req.user.phone }).countDocuments();
    const [maintenances, totalLength] = await Promise.all([maintenancesQuery.query, totalLengthQuery]);
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: maintenances,
      totalLength
    })
  } catch (e) {
    next(e);
  }
}

const getMaintenance = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(ServerError.badRequest(401, 'maintenance id is required'));
    }
    const maintenance = await Maintenance.findOne({ _id: req.params.id, phone: req.user.phone });
    if (!maintenance) {
      return next(ServerError.badRequest(401, 'maintenance not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: maintenance
    })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllMaintenances,
  getMaintenance
}