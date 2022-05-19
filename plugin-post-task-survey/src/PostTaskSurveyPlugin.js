import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import surveyUtil from './utils/SurveyUtil';


const PLUGIN_NAME = 'PostTaskSurveyPlugin';

export default class PostTaskSurveyPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    //whatsapp survey
    flex.Actions.addListener('afterCompleteTask', (payload) => {
      const { task } = payload;
      const { attributes: taskAttributes, taskSid, channelType } = task;
      const {  customerAddress  } = taskAttributes;
      const { postTaskSurveyMessage } = manager.configuration;

      console.log('Payload');
      console.log(payload);

      if(channelType === 'whatsapp') {

        console.log(`Task SID: ${taskSid}, Channel Type: ${channelType}, Customer Address: ${customerAddress}, Survey Message: ${postTaskSurveyMessage}`);
      
        surveyUtil.sendSurvey(taskSid, channelType, customerAddress, postTaskSurveyMessage);

      }

    });

    //voice survey
    flex.Actions.addListener('beforeHangupCall', async (payload, abortFunction) => {
      const { taskSid } = payload.task;  
      const { call_sid, channelType } = payload.task.attributes;

      surveyUtil.sendVoiceSurvey(taskSid, call_sid, channelType);
    
      abortFunction();
    });

  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }
  }
}
