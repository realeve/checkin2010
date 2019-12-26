import { TabBar } from 'antd-mobile';
import React, { useState } from 'react';
import ValidPage from './setting/valid';
import { connect } from 'dva';
import ListPage from './list';
import NewPage from './setting';
import AdminPage from './admin';

import IconUserActive from './img/friend_add_active.svg';
import IconUser from './img/friend_add.svg';

import IconListActive from './img/list_active.svg';
import IconList from './img/list.svg';

import IconAddActive from './img/add_active.svg';
import IconAdd from './img/add.svg';

function ConfigList({ isAdmin }) {
  if (!isAdmin) {
    return <ValidPage />;
  }
  const [curTab, setCurTab] = useState(0);
  return (
    <div style={{ height: '100vh' }}>
      <TabBar>
        <TabBar.Item
          icon={{ uri: IconList }}
          selectedIcon={{ uri: IconListActive }}
          title="会议列表"
          key="会议列表"
          selected={curTab === 0}
          onPress={() => {
            setCurTab(0);
          }}
        >
          <ListPage />
        </TabBar.Item>
        <TabBar.Item
          icon={{ uri: IconUser }}
          selectedIcon={{ uri: IconUserActive }}
          title="新增管理员"
          key="新增管理员"
          selected={curTab === 1}
          onPress={() => {
            setCurTab(1);
          }}
        >
          <AdminPage />
        </TabBar.Item>
        <TabBar.Item
          icon={{ uri: IconAdd }}
          selectedIcon={{ uri: IconAddActive }}
          title="新增会议"
          key="新增会议"
          selected={curTab === 2}
          onPress={() => {
            setCurTab(2);
          }}
        >
          <NewPage />
        </TabBar.Item>
      </TabBar>
    </div>
  );
}

export default connect(({ common }: any) => ({ isAdmin: common.isAdmin }))(ConfigList);
