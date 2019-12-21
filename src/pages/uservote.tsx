import React from 'react';
import { WingBlank } from 'antd-mobile';
import styles from './index.less';

import QRCode from 'qrcode.react';

export const getUrl = () => {
  let { host, protocol, pathname } = window.location;
  return `${protocol}//${host}/${pathname}#paper`;
};

export default function NewPage() {
  // 扫码登录相关逻辑 start
  const qrcode = getUrl();
  console.log(qrcode);

  return (
    <div className={styles.content}>
      <WingBlank>
        <h2>2.用户投票</h2>
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
