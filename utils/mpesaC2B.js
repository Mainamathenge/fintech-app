const http = require('https');

//C2B Transactions
class MpesaC2bAPI {
  constructor(consumerKey, consumerSecret) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.accessToken = '';
  }

  //Make request
  async _makeRequest(url, method, headers, body) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        url,
        {
          method: method,
          headers: headers,
        },
        res => {
          let responseBody = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            responseBody += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(responseBody));
          });
        }
      );
      req.on('error', err => {
        reject(err);
      });
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  //Generate access token
  async generateAccessToken() {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString('base64');
    const url = process.env.OAUTH_URL;
    const headers = {
      Authorization: `Basic ${auth}`,
    };

    try {
      const response = await this._makeRequest(url, 'GET', headers);
      this.accessToken = response.access_token;
      return this.accessToken;
    } catch (error) {
      throw error;
    }
  }

  //Initiate a c2b stkpush transaction
  async initiatePayment(amount, phone, callbackUrl) {
    const token = await this.generateAccessToken();

    const url = process.env.STK_PUSH_URL;
    const authHeaderToken = `Bearer ${token}`;
    const headers = {
      Authorization: authHeaderToken,
      'Content-Type': 'application/json',
    };
    const shortCode = process.env.C2B_SHORT_CODE;
    const passKey = process.env.C2B_PASS_KEY;
    const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, -3);

    const body = {
      BusinessShortCode: shortCode,
      Password: Buffer.from(`${shortCode}${passKey}${timestamp}`).toString(
        'base64'
      ),
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: 'M-venda',
      TransactionDesc: 'Test',
    };

    try {
      const response = await this._makeRequest(url, 'POST', headers, body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // //Check balance
  async checkBalance() {
    const token = await this.generateAccessToken();
    console.log(token);
    const url = process.env.ACCOUNT_BAL_URL;
    const authHeaderToken = `Bearer ${token}`;
    const headers = {
      Authorization: authHeaderToken,
      'Content-Type': 'application/json',
    };
    const body = {
      Initiator: process.env.C2B_INITIATOR,
      SecurityCredential: process.env.C2B_SECURITY_CREDENTIALS,
      CommandID: 'AccountBalance',
      PartyA: process.env.C2B_SHORT_CODE,
      IdentifierType: '4',
      Remarks: 'bal',
      QueueTimeOutURL: process.env.C2B_TIME_OUT_URL,
      ResultURL: process.env.C2B_RESULT_BAL_URL,
    };

    try {
      const response = await this._makeRequest(url, 'post', headers, body);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = MpesaC2bAPI;