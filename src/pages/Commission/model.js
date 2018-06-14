/**
 * 类Dva数据模型
 * 在rootSaga中配置model
 */
import BaseManager from '../../NetworkManager/BaseManager'

export default {
  namespace: 'commission',
  state: {},
  reducers: {
    mapCommissionList(state, { payload }) {
      return { ...state, commission: payload };
    }
  },
  effects: {
    *fetchCommissionList({ select, call, put }, { payload }) {
        let commission = yield select(state => state.commission.commission); //select拿到当前list数据
        // 解决第一次拿来commission是undefined问题
        if (commission === void 666) {
            commission = {};
        }
        console.log('model文件commission state', commission);

        console.log('开始fetch');
        const baseManager = new BaseManager;
        const res = yield baseManager.fetchApi({
            url: baseManager.Url + 'user/CommissionsList',
            body: {
              type: 0,//佣金页面不涉及type默认0就行
              keyword: '',//也不涉及keyword
              currentpage: payload.pageIndex,
              pagesize: 15
            }
        })

        //console.log('res', res);

        try {
            let items = res.data.items
            console.log('合并前items', items)
            if (items.length !== 0) {          
              items = [...items, ...commission]
              console.log('合并后items', items)
              yield put({
                type: 'mapCommissionList',
                payload: items
              })
            }
          } catch (e) {
            Alert.alert('出错了', '服务请求出错')
          }
    }
  }
};
