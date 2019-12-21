import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import * as db from '@/utils/db';
import * as userLib from '@/utils/user';
import * as lib from '@/utils/lib';
import * as R from 'ramda';

const paper = [
  {
    type: 'input',
    title: '会议名称',
    key: 'metting_name',
  },
  {
    type: 'input',
    title: '会场',
    key: 'place',
  },
  {
    type: 'DatePicker',
    title: '开始日期',
    key: 'start_time',
  },
  {
    type: 'input',
    title: '二维码刷新时长(秒)',
    key: 'refresh_length',
  },
  {
    type: 'input',
    title: '二维码有效时长(秒)',
    key: 'valid_length',
  },
];

function SettingPage() {
  const [state, setState] = useState(['', '', lib.now(), '10', '20']);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState({ msg: '' });

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    // 数据是否完整

    let status = state.findIndex(item => item.trim().length === 0);

    if (status > -1) {
      Toast.fail(`第${status + 1}题未填写`);
      return;
    }

    let { user, start_time: rec_time } = userLib.getUid();
    let param = {
      user,
      rec_time,
    };
    state.forEach((item, idx) => {
      param[paper[idx].key] = item;
    });

    console.log(param);

    return;
    // db.setCbpcyouth2019Votelist(param)
    //   .then(res => {
    //     userLib.gotoSuccess();
    //   })
    //   .catch(e => {
    //     Toast.fail('提交失败');
    //   });
  };

  return (
    <div>
      <div className={styles.content}>
        <FormComponent data={paper} onChange={setState} state={state} showErr={showErr} />
        <WhiteSpace size="lg" />
      </div>
      <WingBlank>
        <Button
          type="primary"
          onClick={onSubmmit}
          loading={loading}
          disabled={loading || state.findIndex(item => item.trim().length === 0) > -1}
        >
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => common)(SettingPage);
