const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const TwilioHelper = require(Runtime.getFunctions()['helpers/twilio-response'].path).TwilioHelper;
const StringsHelper = require(Runtime.getFunctions()['helpers/survey-strings'].path).StringsHelper;


exports.handler = TokenValidator(async (context, event, callback) => {

    const { callSid, taskSid } = event;
    const { TWILIO_SERVERLESS_BASE_URL, SURVEY_LANGUAGE } = context;
    const client = context.getTwilioClient();
    const twiml = new Twilio.twiml.VoiceResponse();

    const responseHelper = new TwilioHelper();
    const surveyHelper = new StringsHelper();   

    try{
        
        const gather = twiml.gather({
            timeout: 10,
            numDigits: 1,
            language: SURVEY_LANGUAGE, 
            action: `${TWILIO_SERVERLESS_BASE_URL}/process-voice-survey?taskSid=${taskSid}`
        });

        gather.say({
            language: SURVEY_LANGUAGE
        },surveyHelper.getString('surveyMessage'));

        await client.calls(callSid)
            .update({twiml: twiml.toString()});

        const response = responseHelper.defaultResponse();

        callback(null, response);

    }

    catch(err){
        const response = responseHelper.genericErrorResponse(err.message);

        callback(response);

    }

    
});