import React from 'react';
import SettingPage from './index';
import UserList from './users';
import ValidPage from './valid';
import { connect } from 'dva';

function SettingList({ match, isAdmin }) {
  let id = match.params.id || 0;
  if (!id || !isAdmin) {
    return <ValidPage />;
  }

  return (
    <div>
      <SettingPage meeting_id={id} />
      <UserList meeting_id={id} />
    </div>
  );
}

export default connect(({ common }: any) => ({ isAdmin: common.isAdmin }))(SettingList);
