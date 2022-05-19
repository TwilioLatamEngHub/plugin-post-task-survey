const fs = require('fs');

class StringsHelper {
    constructor() {
        const file = Runtime.getAssets()['/survey-strings.json'].path;
        this.strings = JSON.parse(fs.readFileSync(file).toString('utf-8'));
    }

    getString(string) {
      return this.strings[string];
    }
    
  }
  
  /** @module twilioHelper */
  module.exports = {
    StringsHelper,
  };