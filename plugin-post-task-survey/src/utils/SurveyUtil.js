import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();

class SurveyUtil {
    sendSurvey = async (taskSid, channelType, customerAddress, message) => {
        console.debug('Sending Survey:', taskSid, channelType, customerAddress);
        if(process.env.FLEX_APP_SURVEY_FUNCTIONS_BASE){
            const fetchUrl = `${process.env.FLEX_APP_SURVEY_FUNCTIONS_BASE}/send-survey`;
            const fetchBody = {
                Token: manager.store.getState().flex.session.ssoTokenPayload.token,
                taskSid,
                channelType,
                customerAddress,
                message
            };
            const fetchOptions = {
                method: 'POST',
                body: new URLSearchParams(fetchBody),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            };
        
            let data;
            try {
                const response = await fetch(fetchUrl, fetchOptions);
                data = await response.json();
                console.debug('Persona data:', data);
            } catch (error) {
                console.error(error);
            }
        
            return data;
        }

        else {
            console.log('No Survey Service Base URL');
            return;
        };
    }

    sendVoiceSurvey = async (taskSid, callSid, channelType) => {
        console.debug('Sending Survey:', callSid, channelType);
        if(process.env.FLEX_APP_SURVEY_FUNCTIONS_BASE){
            const fetchUrl = `${process.env.FLEX_APP_SURVEY_FUNCTIONS_BASE}/send-voice-survey`;
            const fetchBody = {
                Token: manager.store.getState().flex.session.ssoTokenPayload.token,
                callSid,
                taskSid
                
            };
            const fetchOptions = {
                method: 'POST',
                body: new URLSearchParams(fetchBody),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            };
        
            let data;
            try {
                const response = await fetch(fetchUrl, fetchOptions);
                data = await response.json();
                console.debug('Persona data:', data);
            } catch (error) {
                console.error(error);
            }
        
            return data;
        }
    
        else {
            console.log('No Survey Service Base URL');
            return;
        };
    }
    

}

const surveyUtil = new SurveyUtil();

export default surveyUtil;