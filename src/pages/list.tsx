import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast, List } from 'antd-mobile';
import styles from './paper.less';
import { connect } from 'dva';
import * as db from '@/utils/db';

function SettingPage() {
  return (
    <List renderHeader="会议列表">
      <div>asdfasd</div>
      <div>asdfasd</div>
      <div>asdfasd</div>
      <div>asdfasd</div>
    </List>
  );
}

export default connect(({ common }: any) => common)(SettingPage);
