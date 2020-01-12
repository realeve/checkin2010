import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from '../index.less';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import * as db from '@/utils/db';
import * as userLib from '@/utils/user';
import * as lib from '@/utils/lib';
import Excel from '@/utils/excel';
import ValidPage from './valid';

const paper = [
  {
    type: 'input',
    title: '会议名称',
    key: 'meeting_name',
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

function SettingPage({ meeting_id, isAdmin }) {
  if (!isAdmin) {
    return <ValidPage />;
  }

  const [state, setState] = useState(['', '', lib.now(), '10', '20']);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState({ msg: '' });

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);
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
    // 🥜

    console.log(param);
    db.addMeetSetting(param)
      .then(() => {
        userLib.gotoSuccess();
      })
      .catch(() => {
        Toast.fail('提交失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [downloadData, setDownloadData] = useState(null);

  // loading
  useEffect(() => {
    if (!meeting_id) {
      return;
    }

    db.getMeetSettingDetail(meeting_id).then(res => {
      if (res.rows === 0) {
        return;
      }
      let data = res.data[0];
      setState(data);
    });
    db.getMeetCheckin(meeting_id).then(res => {
      res.data = res.data.map(item => {
        item[1] = "'" + item[1];
        item[3] = "'" + item[3];
        return item;
      });
      setDownloadData(res);
    });
  }, []);

  const onDownload = () => {
    if (!downloadData) {
      Toast.fail('数据载入失败');
      return;
    }
    let excel = new Excel({
      filename: state[2] + ' ' + state[0],
      header: downloadData.header,
      body: downloadData.data,
    });
    excel.save();
  };

  return (
    <div>
      <div className={styles.content}>
        <FormComponent data={paper} onChange={setState} state={state} showErr={showErr} />
        <WhiteSpace size="lg" />
      </div>

      {!meeting_id && (
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
      )}
      {meeting_id && (
        <WingBlank style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={onDownload}>
            下载文件({(downloadData && downloadData.rows) || 0}人签到)
          </Button>
        </WingBlank>
      )}
    </div>
  );
}

export default connect(({ common }: any) => ({ user: common.user, isAdmin: common.isAdmin }))(
  SettingPage,
);
