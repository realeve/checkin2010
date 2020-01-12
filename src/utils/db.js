import { axios, _commonData } from './axios';

/**
*   @database: { 微信开发 }
*   @desc:     { 添加会议设置 } 
    const { meeting_name, place, start_time, refresh_length, valid_length, user, rec_time } = params;
*/
export const addMeetSetting = params =>
  axios({
    url: '/222/4e6b7c2fd3.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 会议列表 }
 */
export const getMeetSetting = (_id = 999999) =>
  axios({
    url: '/223/df7a4fcc90.json',
    params: {
      _id,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 会议详情 }
 */
export const getMeetSettingDetail = _id =>
  axios({
    url: '/227/f5677b29d3.array',
    params: {
      _id,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 签到人员查询 }
 */
export const getMeetCheckin = meeting_id =>
  axios({
    url: '/228/3c3cb43f3e.array',
    params: {
      meeting_id,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 签到人员列表依次查询 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { meet_id, _id } = params;
*/
export const getMeetCheckinDetail = params =>
  axios({
    url: '/229/7cf87521e8.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 用户身份认证 }
 */
export const getMeetAdminList = user =>
  axios({
    url: '/230/d780ca311d.json',
    params: {
      user,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 添加管理员 }
 */
export const addMeetAdminList = user =>
  axios({
    url: '/231/8dec219250.json',
    params: {
      user,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 二维码展示信息 } 
    const { _id, nonce } = params;
*/
export const getMeetSettingQR = params =>
  axios({
    url: '/232/fd11f6e5e1.array',
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 签到 } 
    const { meet_id, user, org_name, id_card, username, phone, education, rec_time } = params;
*/
export const addMeetCheckin = params =>
  axios({
    url: '/233/1b4866b7cc.json',
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 是否签到 } 
    const { user, meet_id } = params;
*/
export const getMeetCheckin_user = params =>
  axios({
    url: '/234/6d635abc10.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 签到总人数 }
 */
export const getMeetCheckinNum = meet_id =>
  axios({
    url: '/235/f7fed22bc8.json',
    params: {
      meet_id,
    },
  }).then(res => res.data[0].checkin_num);

/**
*   @database: { 微信开发 }
*   @desc:     { 会议设置 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
	@nonce:_nonce. 参数说明：接口唯一字符串变量
    const { _id, valid_length, _nonce } = params;
*/
export const getMeetBaseSetting = params =>
  axios({
    url: '/236/18990fcc32.json',
    params,
  });
