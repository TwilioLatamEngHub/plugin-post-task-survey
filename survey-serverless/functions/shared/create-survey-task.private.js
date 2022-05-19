module.exports.createSurveyTask = async function (context, originalTaskSid, surveyMeasure) {
    const client = context.getTwilioClient();

    const { TWILIO_WORKSPACE_SID, TWILIO_SURVEY_WORKFLOW_SID } = context;

    const taskAttributes = {
        conversations: {
            abandoned: 'No',
            communication_channel: 'Survey',
            kind: 'Survey',
            content: 'Post Task Survey',
            conversation_id: originalTaskSid,
            direction: 'Inbound',
            initiated_by: 'Customer',
            outcome: 'Survey Complete',
            conversation_measure_1: parseInt(surveyMeasure) || 0,           //if submitted value isn't a number, ignores the answer
            virtual: 'Yes'
        }
    }

    try{
        const surveyTask = await client.taskrouter.workspaces(TWILIO_WORKSPACE_SID)
        .tasks
        .create({
            attributes: JSON.stringify(taskAttributes),
            workflowSid: TWILIO_SURVEY_WORKFLOW_SID,
            taskChannel: 'survey',
            timeout: 1
        })

    
        console.log(surveyTask.sid);

        return surveyTask;
    }

    catch(err){
        console.log(err);
        return err;
    }
   
}