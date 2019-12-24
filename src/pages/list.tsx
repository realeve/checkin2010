import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast, List, ListView } from 'antd-mobile';
import styles from './paper.less';
import { connect } from 'dva';
import * as db from '@/utils/db';

const data = [
  {
    id: 1,
    title: '某个会议1',
    place: '会议的地点',
    time: '会议的时间',
  },
  {
    id: 2,
    title: '某个会议2',
    place: '会议的地点',
    time: '会议的时间',
  },
  {
    id: 3,
    title: '某个会议3',
    place: '会议的地点',
    time: '会议的时间',
  },
];
const NUM_ROWS = 20;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = pIndex * NUM_ROWS + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    // simulate initial Ajax
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 600);
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     });
  //   }
  // }

  onEndReached = event => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = { ...this.rData, ...genData(++pageIndex) };
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  };

  render() {
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
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={obj.id} style={{ padding: '0 15px' }}>
          <div
            style={{
              lineHeight: '50px',
              //   color: '#FF6E27',
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
        ref={el => (this.lv = el)}
        dataSource={this.state.dataSource}
        renderHeader={() => <span>会议列表</span>}
        renderFooter={() => (
          <div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
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
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}
