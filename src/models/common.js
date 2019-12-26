import {
    setStore
} from '@/utils/lib';
import weixin from '@/utils/WeiXin';
import * as users from '@/utils/user';
import * as db from '@/utils/db';
const namespace = 'common';
export default {
    namespace,
    state: {
        user: {},
        paper: [],
        logInfo: {
            uid: 0,
            provider: 0,
        },
        hasSubmitted: 0,
        result: {
            title: '提交成功',
            status: 'success',
        },
        status: 0,
        isAdmin: -1
    },
    reducers: {
        setStore,
    },
    effects: {
        * init({}, {
            select,
            put,
            call
        }) {
            let {
                user,
                isAdmin
            } = yield select(state => state.common);
            if (!user.user) {
                user = users.getUid();
                yield put({
                    type: 'setStore',
                    payload: {
                        user,
                    },
                });
            }

            if (isAdmin === -1) {
                isAdmin = window.localStorage.getItem('_isAdmin') || -1;
            }
            if (isAdmin > -1) {
                // 值为0或1时，表示已经载入结果，停止加载
                yield put({
                    type: 'setStore',
                    payload: {
                        isAdmin: parseInt(isAdmin),
                    },
                });
                return;
            }


            let {
                rows
            } = yield call(db.getMeetAdminList, user.user)
            isAdmin = rows === 0 ? 0 : 1;
            window.localStorage.setItem('_isAdmin', isAdmin)
            yield put({
                type: 'setStore',
                payload: {
                    isAdmin,
                },
            });

        },
        *
        getWxUser(_, {
            put,
            call,
            select
        }) {
            // 调整用户信息获取
            let user = yield select(state => state.common.user);
            if (user.openid) {
                return;
            }

            user = yield call(weixin.getWxUserInfo);
            console.log('用户信息载入完毕', user);
            if (!user) {
                return;
            }

            yield put({
                type: 'setStore',
                payload: {
                    user,
                },
            });
        },
    },
    subscriptions: {
        async setup({
            dispatch,
            history
        }) {
            // 不获取个人信息
            // await dispatch({ type: 'getWxUser' });
            await weixin.init(false);

            return history.listen(() => {
                dispatch({
                    type: 'init',
                });
            });
        },
    },
};