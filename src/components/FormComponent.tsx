import React from 'react';
import { TextareaItem, List, DatePicker, InputItem } from 'antd-mobile';
import RadioComponent from '@/components/RadioComponent';
import CheckboxComponent from '@/components/CheckboxComponent';
import NestRadio from '@/components/NestRadio';
import * as R from 'ramda';
import { IPaper } from '@/utils/paperData';
import dayjs from 'dayjs';

export interface IPropsForm {
  data: any;
  onChange: any;
  state: any;
  showKey?: boolean;
  [key: string]: any;
}
export default function FormComponent({ data, onChange, showKey = true, state }: IPropsForm) {
  return data.map(({ title, data, type = 'radio', subTitle, ...props }: IPaper, key: number) => {
    let idxTitle = showKey ? `${key + 1}.${title}` : title;

    let prop = {
      onChange,
      title: idxTitle,
      idx: key,
      key,
      state,
      data: typeof data === 'string' ? [data] : data,
      length: props.length,
      sort: props.sort,
      maxLength: props.maxLength,
      value: state[key] || '',
    };

    switch (type) {
      case 'radio':
        return <RadioComponent {...prop} />;
      case 'checkbox':
        if (typeof subTitle !== 'undefined' && typeof subTitle !== 'string') {
        }
        prop.title += props.length ? '' : '(可多选)';
        return <CheckboxComponent {...prop} />;
      case 'group':
        if (typeof subTitle !== 'undefined' && typeof subTitle !== 'string') {
          return <NestRadio subTitle={subTitle} {...prop} />;
        }
        return null;
      case 'input':
        let { onChange, idx, ...rest } = prop;
        return (
          <List renderHeader={prop.title} key={key}>
            <InputItem
              {...rest}
              clear
              onChange={val => {
                let nextState: string[] = R.clone(state);
                nextState[idx] = val;
                onChange(nextState);
              }}
              placeholder="请在此输入"
            />
          </List>
        );

      case 'textarea':
        let cascade = typeof props.cascade === 'number';
        let needRemark = cascade && Number(state[key - 1]) === props.cascade;
        return (
          <List renderHeader={prop.title} key={key}>
            <TextareaItem
              disabled={cascade && !needRemark}
              value={
                cascade && !needRemark
                  ? '无'
                  : typeof state[key] === 'undefined'
                  ? ''
                  : String(state[key])
              }
              onChange={val => {
                let nextState: (string | string[])[] = R.clone(state);
                let res: string =
                  (props.cascade && state[key - 1] == '1') || typeof val === 'undefined'
                    ? '无'
                    : val;
                nextState[key] = res.trim();
                prop.onChange(nextState);
              }}
              rows={2}
              placeholder="请在此输入"
              clear={true}
            />
          </List>
        );
      case 'DatePicker':
        return (
          <DatePicker
            minDate={new Date('2019-12-21')}
            // maxDate={new Date()}
            mode="date"
            title={idxTitle}
            value={new Date(state[key])}
            key={key}
            onChange={(e: Date) => {
              console.log(e);
              let nextState: (string | string[])[] = R.clone(state);
              nextState[key] = dayjs(e).format('YYYY-MM-DD');
              prop.onChange(nextState);
            }}
          >
            <List.Item arrow="horizontal">{prop.title}</List.Item>
          </DatePicker>
        );
      default:
        return prop.title;
    }
  });
}
