const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const TwilioHelper = require(Runtime.getFunctions()['helpers/twilio-response'].path).TwilioHelper;


exports.handler = TokenValidator(async (context, event, callback) => {
  const client = context.getTwilioClient();
  const { TWILIO_SURVEY_FLOW_SID, TWILIO_WHATSAPP_NUMBER, SURVEY_CLOSE_AFTER_HOURS } = context;

  const responseHelper = new TwilioHelper();

  const { taskSid, customerAddress, message } = event;

  try{


    const conversation = await client.conversations.conversations
      .create({
        friendlyName: 'Survey Conversation',
        attributes: JSON.stringify({
          taskSid
        }),
        timers:{
          closed: `PT${SURVEY_CLOSE_AFTER_HOURS}H`  
        }
    });


    await client.conversations.conversations(conversation.sid)
      .webhooks
      .create({
        target: 'studio',
        'configuration.flowSid': TWILIO_SURVEY_FLOW_SID,
        'configuration.filters': [ 'onMessageAdded' ],
        'configuration.replayAfter': 0          // this ensures that the webhook will always run on first message

      })
      .then(webhook => console.log(webhook.sid));

    await client.conversations.conversations(conversation.sid)
      .participants
      .create({
       'messagingBinding.address': customerAddress,
       'messagingBinding.proxyAddress': `whatsapp:${TWILIO_WHATSAPP_NUMBER}`
      })
      .then(participants => console.log(participants.sid));


    await client.conversations.conversations(conversation.sid)
      .messages
      .create({
        author: 'system',
        body: message
      })
      .then(message => console.log(message.sid));


    const response = responseHelper.defaultResponse();
    response.setBody({message: 'Post Task Survey successfully sent'});

    callback(null,response);


  }

  catch(err){
    console.error(err);
    const response = responseHelper.genericErrorResponse(err.message);
    callback(response);
  }

  
});
