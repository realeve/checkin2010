import React from 'react';
import { Result, Icon } from 'antd-mobile';

import { connect } from 'dva';

const validPage = ({ user }) => (
  <Result
    img={
      <Icon
        type="cross-circle-o"
        className="spe"
        style={{ fill: '#F13642', width: 60, height: 60 }}
      />
    }
    title="身份校验失败"
    message={
      <div>
        请将以下信息复制给管理员添加身份信息
        <p>{user.user}</p>
      </div>
    }
  />
);

export default connect(({ common }: any) => ({ user: common.user }))(validPage);
