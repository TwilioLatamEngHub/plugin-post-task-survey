class TwilioHelper {
    constructor(logger) {
      this.logger = logger;
    }
    defaultResponse() {
      const response = this._defaultResponse();
      return response;
    }
  
    badRequestResponse(message) {
      const response = this._defaultResponse();
      response.setStatusCode(400);
      response.setBody(message);
      return response;
    }
  
    forbiddenResponse() {
      const response = this._defaultResponse();
      response.setStatusCode(403);
      return response;
    }

    genericErrorResponse(message) {
      const response = this._defaultResponse();
      response.setStatusCode(500);
      response.setBody(message)
      return response;
    }
  
    _defaultResponse() {
      const response = new Twilio.Response(); //eslint-disable-line no-undef
      response.appendHeader('Access-Control-Allow-Origin', '*');
      response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.appendHeader('Content-Type', 'application/json');
      return response;
    }
  
    createClient(context) {
      const { ACCOUNT_SID, AUTH_TOKEN } = context;
      return require('twilio')(ACCOUNT_SID, AUTH_TOKEN, {
        lazyLoading: true,
      });
    }
  }
  
  /** @module twilioHelper */
  module.exports = {
    TwilioHelper,
  };
  