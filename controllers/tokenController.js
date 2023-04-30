const axios = require("axios");

const createToken = async (req, res, next) => {
  const secret = process.env.Mpesa_Consumer_Secret;
  const consumer = process.env.Mpesa_Consumer_key;
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      token = data.data.access_token;
      console.log(token);
      return next();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
};

const postStk = async (req, res) => {
  const shortCode = 174379;
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  // let token;
  // // if (
  // //   req.headers.authorization &&
  // //   req.headers.authorization.startsWith('Bearer')
  // // ) {
  // //   token = req.headers.authorization.split(' ')[1];
  // // }
  // //console.log(token);
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: 174379,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://5dc1-197-232-155-144.ngrok-free.app/token/callback",
    AccountReference: "Mpesa Test",
    TransactionDesc: "Testing stk push",
  };

  await axios
    .post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((data) => {
      console.log(data);
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
};

const callback = async (req, res, next) => {
  const mpesa_response = req.body;
  console.log(mpesa_response);
};

module.exports = { createToken, postStk , callback };