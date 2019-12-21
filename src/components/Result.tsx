import React from 'react';
import { Result, Icon } from 'antd-mobile';
import waitingIcon from './waiting.svg';

export default function ResultComponent({
  title = '提交成功',
  status = 'success',
  message = '感谢您的参与！',
  extra = '',
}) {
  let img = (
    <Icon
      type="check-circle"
      style={{
        fill: '#1F90E6',
        width: 60,
        height: 60,
      }}
    />
  );
  if (status === 'error') {
    img = (
      <Icon
        type="cross-circle-o"
        style={{
          fill: '#F13642',
          width: 60,
          height: 60,
        }}
      />
    );
  } else if (status === 'waiting') {
    img = <img src={waitingIcon} className="am-result-pic" alt="" />;
  }
  return <Result img={img} title={title} message={message + extra} />;
}
