import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast, ListView } from 'antd-mobile';
import styles from './paper.less';
import * as db from '@/utils/db';
import { useSetState } from 'react-use';
import * as R from 'ramda';

export default function ListPage() {
  const [state, setState] = useSetState({
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    isLoading: true,
    hasMore: true,
    rData: [],
  });

  // 初始id
  const [maxId, setMaxId] = useState(9999999);

  const refresh = async () => {
    setState({ isLoading: true });
    let { data: rData } = await db.getMeetSetting(maxId);

    let hasMore = true;
    if (rData.length < 5) {
      hasMore = false;
    }
    if (rData.length > 0) {
      let lastData = R.last(rData);
      setMaxId(lastData.id);
    }

    let nextData = R.concat(state.rData, rData);

    setState({
      dataSource: state.dataSource.cloneWithRows(nextData),
      isLoading: false,
      rData: nextData,
      hasMore,
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  // load new data
  const onEndReached = event => {
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (state.isLoading && !state.hasMore) {
      return;
    }
    console.log('reach end', event);
    refresh();
  };

  const separator = (sectionID, rowID) => (
    <div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />
  );
  let index = state.rData.length - 1;
  const row = (rowData, sectionID, rowID) => {
    if (index < 0) {
      index = state.rData.length - 1;
    }
    const obj = state.rData[index--];
    return (
      <div key={obj.id} style={{ padding: '0 15px' }}>
        <div
          style={{
            lineHeight: '50px',
            fontSize: 18,
            fontWeight: 'bold',
            borderBottom: '1px solid #F6F6F6',
          }}
        >
          {parseInt(rowID) + 1}.{obj.title}
        </div>
        <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{ marginBottom: '8px' }}>地点:{obj.place}</div>
            <div>
              <span style={{ fontSize: '12px', color: '#b2b2b2' }}>时间:{obj.time}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ListView
      dataSource={state.dataSource}
      renderHeader={() => <span>会议列表</span>}
      renderFooter={() => (
        <div style={{ padding: 30, textAlign: 'center' }}>
          {state.isLoading ? '加载中...' : '没有数据了'}
        </div>
      )}
      renderRow={row}
      renderSeparator={separator}
      className="am-list"
      pageSize={4}
      useBodyScroll
      // onScroll={() => {
      //   console.log('scroll');
      // }}
      scrollRenderAheadDistance={500}
      onEndReached={onEndReached}
      onEndReachedThreshold={10}
    />
  );
}
