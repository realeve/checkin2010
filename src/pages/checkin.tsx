import React, { useState, useEffect } from 'react';
import { Toast } from 'antd-mobile';

import { connect } from 'dva';
import * as db from '@/utils/db';
import qs from 'qs';
import * as lib from '@/utils/lib';
import moment from 'moment';
import { useSetState } from 'react-use';
import Result from '@/components/Result';
import * as userLib from '@/utils/user';

const getCfg = () => {
  let str = window.location.hash.split('?')[1];
  if (!str || !str.includes('id') || !str.includes('t') || !str.includes('v')) {
    return false;
  }
  return qs.parse(str);
};
function NewPage({ user }: any) {
  const [cfg, setCfg] = useState({});
  let [result, setResult] = useSetState({
    title: '签到中',
    status: 'waiting',
    message: '感谢您的参与。',
    extra: '',
    hide: false,
  });

  useEffect(() => {
    let res = getCfg();
    if (!res) {
      setResult({
        title: '无效链接',
        message: '链接无效，请重新扫码再试。',
        status: 'error',
        hide: false,
      });
      return;
    }

    setCfg(res);

    let isValid = moment(Number(res.t))
      .add(parseInt(res.v || '1', 10), 's')
      .isAfter(moment());
    if (!isValid) {
      setResult({
        title: '签到失败',
        message: '二维码超时，请重新扫码。',
        status: 'error',
        hide: false,
      });
      return;
    }

    db.getMeetUsersId({
      meet_id: res.id,
      user: user.user,
    }).then(res => {
      if (res.rows === 0) {
        setResult({
          title: '无效签到',
          message: '请先从公众号菜单中进入页面填写基础信息',
          status: 'error',
          hide: false,
        });
        return;
      }
      let user_id = res.data[0].user_id;
      let rec_time = lib.now();
      let params = { user_id, rec_time };
      onSubmmit(params);
    });
  }, []);

  const onSubmmit = async param => {
    if (!param.user_id) {
      return;
    }

    db.addMeetCheckin(param)
      .then(res => {
        userLib.gotoSuccess(0);
      })
      .catch(e => {
        Toast.fail('提交失败');
      });
  };

  return <Result {...result} />;
}

export default connect(({ common }: any) => ({ ...common }))(NewPage);
