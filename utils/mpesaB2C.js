const http = require('https');

//B2C Transactions
class MpesaB2cAPI {
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
  async generateToken() {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString('base64');
    const url = process.env.Mpesa_request;
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

  // Initiate a B2C transaction
  async initiateTransaction(amount, phone) {
    const token = await this.generateToken();

    const url = process.env.B2C_REQUEST_URL;
    const authHeaderToken = `Bearer ${token}`;
    const headers = {
      Authorization: authHeaderToken,
      'Content-Type': 'application/json',
    };
    const body = {
      InitiatorName: process.env.B2C_INITIATOR,
      SecurityCredential: process.env.B2C_SECURITY_CREDENTIALS,
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: process.env.B2C_SHORT_CODE,
      PartyB: phone,
      Remarks: 'Request b2c payment',
      QueueTimeOutURL: process.env.B2C_TIME_OUT_URL,
      ResultURL: process.env.B2C_RESULT_URL,
      TransactionDesc: 'Withdraw from',
    };

    try {
      const response = await this._makeRequest(url, 'post', headers, body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //Check b2c paybill balance
  async checkBalance() {
    const token = await this.generateToken();
    const url = process.env.ACCOUNT_BAL_URL;
    const authHeaderToken = `Bearer ${token}`;
    const headers = {
      Authorization: authHeaderToken,
      'Content-Type': 'application/json',
    };
    const body = {
      Initiator: process.env.B2C_INITIATOR,
      SecurityCredential: process.env.B2C_SECURITY_CREDENTIALS,
      CommandID: 'AccountBalance',
      PartyA: process.env.B2C_SHORT_CODE,
      IdentifierType: '4',
      Remarks: 'bal',
      QueueTimeOutURL: process.env.B2C_TIME_OUT_URL,
      ResultURL: process.env.B2C_RESULT_BAL_URL,
    };

    try {
      const response = await this._makeRequest(url, 'post', headers, body);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MpesaB2cAPI;