import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import * as db from '@/utils/db';
import * as userLib from '@/utils/user';
import * as R from 'ramda';

function NewPage({ paper: initData, user, dispatch }: any) {
  const [state, setState] = useState(['']);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(initData.length === 0 ? {} : { msg: '' });

  const [paper, setPaper] = useState([]);
  useEffect(() => {
    db.getCbpcyouth2019Votelist().then(({ data }) => {
      let res = R.flatten(data);
      setPaper([
        {
          title: '请选择您支持的战队:',
          data,
        },
      ]);
    });
  }, []);

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

    let param = {};

    param.user = user.user;
    param.vote = state[0];
    db.setCbpcyouth2019Checkin(param)
      .then(res => {
        userLib.gotoSuccess();
      })
      .catch(e => {
        Toast.fail('提交失败,请勿重复投票');
      });
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
          disabled={loading || state[0].length === 0}
        >
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(NewPage);
