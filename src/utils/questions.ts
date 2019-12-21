import * as lib from './lib';

// 题目
export interface IPaper {
  title: string;
  data: string | string[];
  subTitle?: string | string[];
  type?: string;
  cascade?: number;
  [key: string]: any;
}

let paper: IPaper[] = [
  {
    title: '请选择您喜欢的组',
    data: `第1组
    第2组
    第3组
    第4组
    第5组
    第6组`,
  },
];

export let paperData = lib.handlePaper(paper);

export default paperData;
