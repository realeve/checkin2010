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


/**
 *   @database: { 微信开发 }
 *   @desc:     { 会议详情 } 
 */
export const getMeetSettingDetail = _id => axios({
    url: '/227/f5677b29d3.array',
    params: {
        _id
    },
});


/**
 *   @database: { 微信开发 }
 *   @desc:     { 签到人员查询 } 
 */
export const getMeetCheckin = meeting_id => axios({
    url: '/228/3c3cb43f3e.array',
    params: {
        meeting_id
    },
});



/**
*   @database: { 微信开发 }
*   @desc:     { 签到人员列表依次查询 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { meet_id, _id } = params;
*/
export const getMeetCheckinDetail = params => axios({
    url: '/229/7cf87521e8.json',
    params,
});

/**
 *   @database: { 微信开发 }
 *   @desc:     { 用户身份认证 } 
 */
export const getMeetAdminList = user => axios({
    url: '/230/d780ca311d.json',
    params: {
        user
    },
});


/**
 *   @database: { 微信开发 }
 *   @desc:     { 添加管理员 } 
 */
export const addMeetAdminList = user => axios({
    url: '/231/8dec219250.json',
    params: {
        user
    },
});