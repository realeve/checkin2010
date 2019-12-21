import { axios, _commonData } from './axios';

/**
*   @database: { 微信开发 }
*   @desc:     { 团委-签到 } 
    const { user, timestamp, rec_time } = params;
*/
export const addCbpcyouth2019Checkin = params =>
  axios({
    url: '/216/0d27b05155.json',
    params,
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 团委-签到总人数 }
 */
export const getCbpcyouth2019Checkin = () =>
  axios({
    url: '/217/d23723aedc.json',
  }).then(res => res.data[0].num);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 战队列表 }
 */
export const getCbpcyouth2019Votelist = () =>
  axios({
    url: '/218/72c0b1638e.array',
  });
/**
*   @database: { 微信开发 }
*   @desc:     { 战队投票 } 
    const { vote, user } = params;
*/
export const setCbpcyouth2019Checkin = params =>
  axios({
    url: '/219/f0673d15f4.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 观众投票情况 }
 */
export const getCbpcyouth2019CheckinVotes = () =>
  axios({
    url: '/220/a93dec6422.json',
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 更新评委打分 } 
    const { score_0, score_1, score_2, score_3, score_4, score_5 } = params;
*/
export const setCbpcyouth2019Votelist = params =>
  axios({
    url: '/221/c35b24cae1.json',
    params,
  });
