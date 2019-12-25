import React from 'react';
import SettingPage from './index';
import UserList from './users';
export default function SettingList({ match }) {
  let id = match.params.id || 0;
  if (!id) {
    return <div>无效页面</div>;
  }

  return (
    <div>
      <SettingPage meeting_id={id} />
      <UserList meeting_id={id} />
    </div>
  );
}
