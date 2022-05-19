const createSurveyTask = require(Runtime.getFunctions()['shared/create-survey-task'].path).createSurveyTask;


exports.handler = function(context, event, callback){
    const client = context.getTwilioClient();

    const { originalTaskSid, conversationSid, surveyMeasure } = event;

    
    const surveyTask = createSurveyTask(context,originalTaskSid,surveyMeasure)
        .then(task => console.log(task.sid))
        .catch(err => callback(err));

    
    const updatedConversation = client.conversations.conversations(conversationSid)
        .update({state: 'closed'})
        .then(conversation => console.log(conversation.state))
        .catch(err => callback(err));

    //wait until all promises are fulfilled
    Promise.all([surveyTask, updatedConversation])
        .then(values => callback(null,values));

    
}