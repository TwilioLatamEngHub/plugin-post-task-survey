const createSurveyTask = require(Runtime.getFunctions()['shared/create-survey-task'].path).createSurveyTask;
const StringsHelper = require(Runtime.getFunctions()['helpers/survey-strings'].path).StringsHelper;


exports.handler = function(context, event, callback) {
    const response = new Twilio.twiml.VoiceResponse();
    const { SURVEY_LANGUAGE, TWILIO_SERVERLESS_BASE_URL } = context;
    const { taskSid, Digits } = event;
    const validDigits = "12345".split('');


    try{
        const surveyHelper = new StringsHelper();

        if(!validDigits.includes(Digits)) {
            //this action will create a callback loop until a valid answer is input. If you wish to ignore invalid answers, just hang up the call. If you wish to implement a retryCount, you can pass it as a query param and evaluate it in the call back

            const gather = response.gather({
                timeout: 10,
                numDigits: 1,
                language: SURVEY_LANGUAGE, 
                action: `${TWILIO_SERVERLESS_BASE_URL}/process-voice-survey?taskSid=${taskSid}`
            });
    
            gather.say({
                language: SURVEY_LANGUAGE
            },surveyHelper.getString('retryMessage'));
    
            return callback(null, response);
        }
        
        createSurveyTask(context,taskSid,Digits)
            .then(task => {
                console.log(task.sid);
                response.say({
                    language: SURVEY_LANGUAGE
                },surveyHelper.getString('thankYouMessage'));
                callback(null, response);
            })
            .catch(err => callback(err));

    }

    catch(err){
        console.log(err.message);
        callback(err);
    }

    

    
  };