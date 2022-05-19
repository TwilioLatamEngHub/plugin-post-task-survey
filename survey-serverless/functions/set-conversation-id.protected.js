// Flex Insights Set Conversation TaskSid
// This function is called from studio following the Send to Flex widget. 
// Input: taskSid in studio set it to {{SEND_TO_FLEX_WIDGET.sid}}
//
// Check for valid Twilio signature = true if using Twilio Functions Legacy
//
exports.handler = function(context, event, callback) {
    const taskSid = event.taskSid;
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const workspaceSid = context.TWILIO_WORKSPACE_SID
    const client = require('twilio')(accountSid, authToken);
    client.taskrouter.workspaces(workspaceSid)
                 .tasks(taskSid)
                 .fetch()
                 .then(task => {
                     console.log(task);
                     let attr = JSON.parse(task.attributes);
                     attr.conversations.conversation_id = taskSid;
                     console.log(`with conversations: ${JSON.stringify(attr)}`);
                     client.taskrouter.workspaces(workspaceSid)
                        .tasks(taskSid)
                        .update({attributes: JSON.stringify(attr)})
                        .then(updatedTask => {
                            console.log(`updatedTask: ${updatedTask}`)
                            callback(null, updatedTask);
                        })
                        .catch(error => {
                            console.log(error);
                            callback(error);
                        });
                     }
                     )
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
};