const pulumi = require("@pulumi/pulumi");
const stack = pulumi.getStack();
require('dotenv').config({ path: `.${stack}.env` });

const { Resource, Serverless, CheckServerless, FlexPlugin } = require('twilio-pulumi-provider');

const flexWorkspace = new Resource("flex-workspace", {
  resource: ["taskrouter", "workspaces"],
  attributes: {
      friendlyName: 'Flex Task Assignment'
  }
});

const surveyQueue = new Resource("survey-queue", {
  resource: ["taskrouter", {"workspaces": flexWorkspace.sid}, "taskQueues"],
  attributes: {
    friendlyName: 'Survey',
    targetWorkers: '1==0'
  }

});

const surveyWorkflow = new Resource("survey-workflow", {
  resource: ["taskrouter", {"workspaces": flexWorkspace.sid}, "workflows"],
  attributes: {
    friendlyName: 'Survey Workflow',
    taskReservationTimeout: 3,
    configuration: pulumi.all([surveyQueue.sid]).apply(([surveyQueueSid]) => JSON.stringify({
      task_routing: {
        default_filter: {
          queue: surveyQueueSid
        }
      }
    }))
  }

});

const surveyTaskChannel = new Resource("survey-channel", {
  resource: ["taskrouter", {"workspaces": flexWorkspace.sid}, "taskChannels"],
  attributes: {
    friendlyName: 'Survey',
    uniqueName: 'Survey'
  }

});

const conversationsServerlessServiceName = 'survey-serverless';
const conversationsServerlessDomain = CheckServerless.getDomainName(conversationsServerlessServiceName, stack);

const conversationsServerless = new Serverless("survey-serverless", {
    attributes: {
      cwd: `./../survey-serverless`,
      serviceName: conversationsServerlessServiceName,
      env: {
        TWILIO_WORKSPACE_SID: flexWorkspace.sid,
        TWILIO_SURVEY_WORKFLOW_SID: surveyWorkflow.sid,
        TWILIO_SURVEY_FLOW_SID: process.env.TWILIO_SURVEY_FLOW_SID,
        TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
        TWILIO_SERVERLESS_BASE_URL: `https://${conversationsServerlessDomain}`,
        SURVEY_LANGUAGE: process.env.SURVEY_LANGUAGE
      },    
      functionsEnv: stack,
      pkgJson: require("./../survey-serverless/package.json")
    }
});


export let output = {
    flexWorkspace: flexWorkspace.sid,
    surveyQueue: surveyQueue.sid,
    surveyWorkflow: surveyWorkflow.sid,
    surveyTaskChannel: surveyTaskChannel.sid,
    conversationsServerless: conversationsServerless.sid,
    conversationsServerlessDomain: `https://${conversationsServerlessDomain}`
}