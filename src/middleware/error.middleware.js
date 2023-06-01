const errorMiddleWare = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'something went wrong';

  if (err.code === 11000) {
    status = 400;
    message = `${Object.keys(err.keyValue)} is already used in another account `
  }
  if (err.name === 'ValidationError') {
    status = 400;
  }
  res.status(status).json({
    ok: false,
    status,
    message
  })
}
module.exports = errorMiddleWare;