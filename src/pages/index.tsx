import React, { useState, useEffect } from 'react';
import { WingBlank } from 'antd-mobile';
import styles from './index.less';
import { useInterval } from 'react-use';
import QRCode from 'qrcode.react';
import moment from 'moment';
import * as db from '@/utils/db';

export const timestamp = () => moment().format('x');

export const getUrl = async () => {
  let { host, protocol, pathname } = window.location;
  return `${protocol}//${host}/${pathname}#checkin?timestamp=${timestamp()}`;
};

export default function NewPage() {
  // 扫码登录相关逻辑 start
  const [qrcode, setQrcode] = useState<string>('');
  const [num, setNum] = useState(0);
  const refreshUrl = async () => {
    let url = await getUrl();
    console.log('Url', url);
    setQrcode(url);

    db.getCbpcyouth2019Checkin().then(res => {
      setNum(res);
    });
  };
  useEffect(() => {
    refreshUrl();
  }, []);

  useInterval(refreshUrl, 5 * 1000);

  return (
    <div className={styles.content}>
      <WingBlank>
        <h2>
          1.现场扫码签到<small>(已签到{num}人)</small>
        </h2>
        <p style={{ textAlign: 'center' }}>未签到者不允许投票</p>
        {/* <a href={qrcode}>{qrcode}</a> */}
        <div className={styles.qr}>
          <QRCode size={400} value={qrcode} />
        </div>
        <div>
          <a href="#">签到</a>
          <a href="#uservote" style={{ marginLeft: 20, marginRight: 20 }}>
            用户投票二维码
          </a>
          <a href="#chart">用户投票结果</a>
        </div>
      </WingBlank>
    </div>
  );
}
