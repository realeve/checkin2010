import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './checkin.less';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import * as db from '@/utils/db';
import * as userLib from '@/utils/user';
import ValidPage from './setting/valid';

function AdminPage({ isAdmin }) {
  if (!isAdmin) {
    return <ValidPage />;
  }
  const [state, setState] = useState(['']);

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

    db.addMeetAdminList(state[0])
      .then(res => {
        userLib.gotoSuccess();
      })
      .catch(e => {
        Toast.fail('提交失败');
      });
  };

  return (
    <div>
      <div className={styles.content}>
        <FormComponent
          data={[
            {
              title: '添加管理员信息',
              type: 'textarea',
            },
          ]}
          onChange={setState}
          state={state}
          showErr={showErr}
        />
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

export default connect(({ common }: any) => ({ ...common }))(AdminPage);
