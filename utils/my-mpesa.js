const axios = require("axios");
const { response } = require("express");
const { token } = require("morgan");

class LipaNaMpesa {
    async createToken () {
        const secret = process.env.Mpesa_Consumer_Secret;
        const consumer = process.env.Mpesa_Consumer_key;
        const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
        try{
         const response= await axios
                                .get(
                                  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
                                  {
                                    headers: {
                                      authorization: `Basic ${auth}`,
                                    },
                                  }
                                )
          //console.log(response.data.access_token);
          this.accessToken = response.data.access_token;
          return this.accessToken;
        }catch(error){
          throw error;
        }
      };
async postStk  (amount,phone)  {
        const token = await this.createToken();
        //console.log(token);
        const shortCode = 174379;
        //const phone = req.body.phone.substring(1);
        //const amount = req.body.amount;
        const passkey =
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
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
          CallBackURL: "https://5dc1-197-232-155-144.ngrok-free.app/cart/callback",
          AccountReference: "Mpesa Test",
          TransactionDesc: "Testing stk push",
        };
      try {
        const response = await axios
                          .post(url, data, {
                            headers: {
                              authorization: `Bearer ${token}`,
                            },
                          });
                          console.log(response.data.CheckoutRequestID)
        return response;
        
      }
      catch(error){
        throw error;
      }
    }

}

module.exports = LipaNaMpesa;