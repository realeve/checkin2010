import {
    axios,
    _commonData
} from './axios';

/**
*   @database: { 微信开发 }
*   @desc:     { 添加会议设置 } 
    const { meeting_name, place, start_time, refresh_length, valid_length, user, rec_time } = params;
*/
export const addMeetSetting = params => axios({
    url: '/222/4e6b7c2fd3.json',
    params,
});