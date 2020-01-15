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
import * as R from 'ramda';
import { filedsCfg } from '../index';

let fieldsName = filedsCfg.map(item => item.title);

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
    type: 'checkbox',
    title: '必填字段',
    key: 'fields',
    data: fieldsName,
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

const tblHeader = '工作单位,身份证号码,姓名,手机号码,学历,进场时间,离场时间,学习分钟数,上下午,性别,所属行政区域,QQ号,座机号码,职称,职务,教学科目,工作年限,开票单位,纳税人识别号,开票电话,开户行,开票地址,开户帐号'.split(
  ',',
);

function SettingPage({ meeting_id, isAdmin }) {
  if (!isAdmin) {
    return <ValidPage />;
  }

  const [state, setState] = useState(['', '', lib.now(), [], '10', '20']);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState({ msg: '' });

  // 数据提交完成
  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);
    // 数据是否完整

    let status = state.findIndex(
      item => (typeof item === 'string' ? item.trim() : item).length === 0,
    );

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

    // 🥜 字段展示处理
    param.fields = param.fields
      .map(idx => {
        let item = filedsCfg[idx];
        return item.key;
      })
      .join(',');

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

    // 初始设置载入
    db.getMeetSettingDetail(meeting_id).then(res => {
      if (res.rows === 0) {
        return;
      }
      let data = res.data[0];
      data[3] = data[3]
        .trim()
        .split(',')
        .map(key => filedsCfg.findIndex(item => item.key === key) + '');
      // console.log(data);
      setState(data);
    });

    // 下载数据相关
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
    let fieldsHeader = state[3].map(idx => filedsCfg[idx].title);
    let appendHeader = '进场时间,离场时间,学习分钟数,上下午'.split(',');

    let header = tblHeader.filter(item => [...fieldsHeader, ...appendHeader].includes(item));
    let idxList = header.map(item => R.findIndex(R.equals(item))(tblHeader));

    let body = downloadData.data.map(row => idxList.map(idx => row[idx]));

    let excel = new Excel({
      filename: state[2] + ' ' + state[0],
      header,
      body,
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
            disabled={
              loading ||
              state.findIndex(
                item => (typeof item === 'string' ? item.trim() : item).length === 0,
              ) > -1
            }
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
