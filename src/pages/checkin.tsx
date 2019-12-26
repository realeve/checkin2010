import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './checkin.less';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import * as db from '@/utils/db';
import qs from 'qs';
import * as lib from '@/utils/lib';
import moment from 'moment';
import { useSetState } from 'react-use';
import Result from '@/components/Result';
import * as userLib from '@/utils/user';

let reg = {
  id: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  phone: /^1[3456789]\d{9}$/,
};

let eduList = '高中及以下,大专,本科,硕士,博士及以上'.split(',');
const getCfg = () => {
  let str = window.location.hash.split('?')[1];
  if (!str || !str.includes('id') || !str.includes('t') || !str.includes('v')) {
    return false;
  }
  return qs.parse(str);
};
function NewPage({ user }: any) {
  const [state, setState] = useState(['']);

  const [loading, setLoading] = useState(false);

  const [cfg, setCfg] = useState({});
  let [result, setResult] = useSetState({
    title: '签到中',
    status: 'waiting',
    message: '感谢您的参与。',
    extra: '',
    hide: true,
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

    db.getMeetCheckin_user({
      meet_id: res.id,
      user: user.user,
    }).then(res => {
      if (res.rows > 0) {
        setResult({
          title: '请勿重复签到',
          message: '您已成功签到',
          status: 'error',
          hide: false,
        });
        return;
      }
      let cfg = JSON.parse(window.localStorage.getItem('_checkin_cfg') || '{}');
      if (!cfg.username) {
        return;
      }

      let params = [cfg.username, cfg.org_name, cfg.education, cfg.id_card, cfg.phone];
      setState(params);
      // onSubmmit(params, res.id);
    });
  }, []);

  const onSubmmit = async (params = state, meet_id) => {
    if (loading) {
      // 不重复提交
      return;
    }
    // 数据是否完整

    let status = params.findIndex(item => item.trim().length === 0);

    if (status > -1) {
      Toast.fail(`第${status + 1}题未填写`);
      return;
    }

    let param = {
      user: user.user,
      org_name: params[1],
      id_card: params[3],
      username: params[0],
      phone: params[4],
      education: params[2],
      rec_time: lib.now(),
    };

    // 有效性校验
    if (!reg.id.test(param.id_card)) {
      Toast.fail(`身份证信息无效`);
      return;
    }
    if (!reg.phone.test(param.phone)) {
      Toast.fail(`手机号码无效`);
      return;
    }

    window.localStorage.setItem('_checkin_cfg', JSON.stringify(param));
    // console.log({
    //   ...param,
    //   education: ['0', '1', '2', '3', '4', '5', '6'].includes(param.education)
    //     ? eduList[param.education]
    //     : param.education,
    //   meet_id: meet_id || cfg.id,
    // });

    db.addMeetCheckin({
      ...param,
      education: ['0', '1', '2', '3', '4', '5', '6'].includes(param.education)
        ? eduList[param.education]
        : param.education,
      meet_id: meet_id || cfg.id,
    })
      .then(res => {
        userLib.gotoSuccess(0);
      })
      .catch(e => {
        Toast.fail('提交失败,请勿重复投票');
      });
  };

  if (!result.hide) {
    return <Result {...result} />;
  }

  return (
    <div>
      <div className={styles.content}>
        <FormComponent
          data={[
            {
              type: 'input',
              title: '姓名',
            },
            {
              type: 'input',
              title: '单位',
            },
            {
              type: 'radio',
              title: '学历',
              data: eduList,
            },
            {
              type: 'input',
              title: '身份证号',
            },
            {
              type: 'input',
              title: '手机号',
            },
          ]}
          onChange={setState}
          state={state}
        />
        <WhiteSpace size="lg" />
      </div>
      <WingBlank>
        <Button
          type="primary"
          onClick={() => {
            onSubmmit();
          }}
          loading={loading}
          disabled={loading || state[0].length === 0}
        >
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(NewPage);
