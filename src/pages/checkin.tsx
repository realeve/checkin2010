import React, { useEffect, useState } from 'react';
import Result from '@/components/Result';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';
import qs from 'qs';
import moment from 'moment';
import { getUid } from '@/utils/user';
import * as db from '@/utils/db';
import { useInterval, useSetState } from 'react-use';

function ResultPage() {
  let [result, setResult] = useSetState({
    title: '签到中',
    status: 'waiting',
    message: '感谢您的参与，稍后将开始投票。',
    extra: '',
  });

  const refresh = () =>
    db.getCbpcyouth2019Checkin().then(res => {
      setResult({ extra: `当前共${res}人签到。` });
    });

  useEffect(() => {
    let user = getUid();
    refresh().then(() => {
      Toast.loading('载入中', 2);
      doVote(user);
    });
  }, []);

  useInterval(refresh, 8 * 1000);

  const doVote = async ({ user, start_time: rec_time }) => {
    let hashArr = window.location.hash.split('?');
    let params = qs.parse(hashArr[1] || '');
    if (hashArr.length < 2) {
      setResult({
        title: '无效链接',
        message: '链接无效，请重新扫码再试。',
        status: 'error',
      });
      return;
    }

    let isValid = moment(Number(params.timestamp))
      .add(70, 's')
      .isAfter(moment());
    if (!isValid) {
      setResult({
        title: '签到失败',
        message: '二维码超时，请重新扫码。',
        status: 'error',
      });
      return;
    }
    let data = {
      timestamp: moment(Number(params.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
      rec_time,
      user: user,
    };
    db.addCbpcyouth2019Checkin(data)
      .then(() => {
        setResult({
          title: '签到成功',
          message: `感谢您的参与，稍后将开始投票。`,
          status: 'success',
        });
      })
      .catch(e => {
        if (e.response.data['Error Message'].includes('Duplicate')) {
          setResult({
            title: '您已签到，请勿重复',
            message: `感谢您的参与，稍后将开始投票。`,
            status: 'success',
          });
        }
      });
  };

  return <Result {...result} />;
}

export default connect(({ common }) => ({ user: common.user }))(ResultPage);
