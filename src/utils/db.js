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

/**
 *   @database: { 微信开发 }
 *   @desc:     { 会议列表 } 
 */
export const getMeetSetting = (_id = 999999) => axios({
    url: '/223/df7a4fcc90.json',
    params: {
        _id
    },
});