const axios = require("axios");

const sendSMS = async (phone ,orderID) => {
  try {
    const res = await axios.post(
      `${process.env.SMS_URL}?username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&sender=${process.env.SMS_SENDER}&environment=1&language=1&mobile=${phone}&message=Your order ${orderID} has been confirmed check it from here https://hatlystore.trendlix.com/orders/${orderID}`,
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendSMS;