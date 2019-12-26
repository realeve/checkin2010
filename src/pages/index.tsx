import React, { useState, useEffect } from 'react';
import { WingBlank, Result, Icon } from 'antd-mobile';
import styles from './index.less';
import { useInterval } from 'react-use';
import QRCode from 'qrcode.react';
import moment from 'moment';
import * as db from '@/utils/db';
import qs from 'qs';

export const timestamp = () => moment().format('x');

export const getUrl = async (cfg: {
  id: number;
  refresh: number;
  valid: number;
  date: string;
  title: string;
  place: string;
}) => {
  let { origin, pathname } = window.location;
  return `${origin}${pathname}#checkin?id=${cfg.id}&t=${timestamp()}&v=${cfg.valid}`;
};

const getMeetid = () => {
  let cfg = window.location.hash.split('?');
  return qs.parse(cfg[1] || 'id=0');
};
export default function NewPage() {
  const [meetCfg, setMeetCfg] = useState({
    id: 0,
    refresh: 10,
    valid: 20,
    date: '',
    title: '',
    place: '',
    nonce: '',
  });

  const refreshUrl = async (cfg = meetCfg) => {
    let url = await getUrl(cfg);
    console.log('Url', url);
    setQrcode(url);

    // db.getCbpcyouth2019Checkin().then(res => {
    //   setNum(res);
    // });
  };

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { id, nonce } = getMeetid();
    db.getMeetSettingQR({
      _id: id,
      _nonce: nonce,
    })
      .then(res => {
        if (res.rows === 0) {
          setIsValid(true);
          return;
        }
        let [title, place, date, refresh, valid] = res.data[0];
        let cfg = {
          id,
          refresh,
          valid,
          date,
          title,
          place,
          nonce,
        };
        setMeetCfg(cfg);
        refreshUrl(cfg);
      })
      .catch(() => {
        setIsValid(true);
      });
  }, []);

  // 扫码登录相关逻辑 start
  const [qrcode, setQrcode] = useState<string>('');
  const [num, setNum] = useState(0);
  useInterval(refreshUrl, meetCfg.refresh * 1000);

  if (isValid) {
    return (
      <Result
        img={
          <Icon
            type="cross-circle-o"
            className="spe"
            style={{ fill: '#F13642', width: 60, height: 60 }}
          />
        }
        title="非法访问"
        message={
          <div>
            会议信息无效,请检查参数信息,格式为:
            <br />
            {window.location.origin}
            {window.location.pathname}#/?id=会议id&nonce=会议身份码
          </div>
        }
      />
    );
  }
  return (
    <div className={styles.content}>
      <WingBlank>
        <h2>{meetCfg.title} 现场签到</h2>
        <p>
          日期:{meetCfg.date} <span style={{ margin: '0 20px' }}>地点:{meetCfg.place}</span> 已签到:
          {num}
        </p>

        {/* 功能测试用 */}
        <a href={qrcode}>{qrcode}</a>

        <div className={styles.qr}>
          <QRCode size={400} value={qrcode} />
        </div>
        <p>(按 F11 全屏，按Esc退出全屏。二维码{meetCfg.refresh}秒自动刷新一次。)</p>
      </WingBlank>
    </div>
  );
}
