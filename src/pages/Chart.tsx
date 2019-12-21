import React, { useState, useEffect } from 'react';
import { List } from 'antd-mobile';
import styles from './paper.less';
import ReactCharts from '@/components/Charts';
import * as db from '@/utils/db.js';
import { useInterval } from 'react-use';
import QRCode from 'qrcode.react';

export const getUrl = () => {
  let { host, protocol, pathname } = window.location;
  return `${protocol}//${host}/${pathname}#paper`;
};

export default function ChartPage() {
  let [chartData, setChartData] = useState([]);
  const qrcode = getUrl();

  const loadPaper = async () => {
    let { data } = await db.getCbpcyouth2019CheckinVotes();
    let dist = [
      { title: '观众投票', data: [] },
      { title: '评委投票', data: [] },
      { title: '综合得分', data: [] },
    ];
    data.forEach(item => {
      dist[0].data.push(item);
      dist[1].data.push({
        name: item.name,
        value: item.score.toFixed(2),
      });
      dist[2].data.push({
        name: item.name,
        value: (Number(item.score) + Number(item.value)).toFixed(2),
      });
    });
    dist = dist.map(item => {
      item.data = item.data.sort((a, b) => Number(a.value) - Number(b.value));
      return item;
    });
    setChartData(dist);
  };

  useEffect(() => {
    loadPaper();
  }, []);

  useInterval(loadPaper, 5 * 1000);

  return (
    <div>
      {/* <h3 style={{ textAlign: 'center', fontWeight: 'normal', letterSpace: '.5em' }}>得分汇总</h3> */}

      <div
        className={styles.content}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {chartData.map((item, idx) => {
          return (
            <List
              renderHeader={`${idx + 1}.${item.title}`}
              key={idx}
              style={{ maxWidth: 500, width: '100%' }}
            >
              <ReactCharts data={item.data} style={{ height: 150 }} type="bar" title="" />
            </List>
          );
        })}
        {/* {window.navigator.userAgent} */}
        {!window.navigator.userAgent.includes('MicroMessenger') && (
          <List
            // className={styles.qr}
            renderHeader="用户投票二维码"
            style={{ maxWidth: 300, width: '100%' }}
          >
            <QRCode size={300} value={qrcode} />
          </List>
        )}
      </div>
    </div>
  );
}
