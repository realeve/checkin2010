import React from 'react';
import Result from '@/components/Result';
import { WhiteSpace, WingBlank, Button } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
function ResultPage({ result }) {
  return (
    <div>
      <Result {...result} />
      <WhiteSpace />
      {!window.location.href.includes('showBtn=0') && (
        <WingBlank>
          <Button
            type="primary"
            onClick={() => {
              router.push('/list');
            }}
          >
            查看会议列表
          </Button>
        </WingBlank>
      )}
    </div>
  );
}
export default connect(({ common: { result } }) => ({
  result,
}))(ResultPage);
