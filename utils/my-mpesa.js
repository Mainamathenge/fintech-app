const axios = require("axios");
const { response } = require("express");
const { token } = require("morgan");

class LipaNaMpesa {
    async createToken () {
        const secret = process.env.C2B_CONSUMER_SECRET;
        const consumer = process.env.C2B_CONSUMER_KEY;
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
        const shortCode = process.env.C2B_SHORT_CODE;
        //const phone = req.body.phone.substring(1);
        //const amount = req.body.amount;
        const passkey = process.env.C2B_PASS_KEY;
        const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
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
          PartyB: process.env.C2B_SHORT_CODE,
          PhoneNumber: `254${phone}`,
          CallBackURL: 'https://first-shop-fu4am.ondigitalocean.app/cart/callback',
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




// manager@perks.africa
// tc@perks.africa
// accountant@perks.africa
// admin@perks.africa
// test1234
// https://dev.perks.africa/
// https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/