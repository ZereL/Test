/**
 * 方正
 * 有了类 dva 的封装
 * 不需要再使用其他的代码，唯一有用的代码是
 * class Rluy 以及
 * app.model
 */

 // 组件中写了watcher 引用watcher
import { watch as PriceList } from "./pages/PriceList/action";
import { watch as Detail } from "./pages/Detail/action";
import { watch as Cart } from "./pages/Cart/action";
import { watch as Manifest } from "./pages/Manifest/action";
import { watch as Home } from "./pages/Home/action";
import { watch as EventPage } from "./pages/EventPage/action";
import { watch as SearchPage } from "./pages/SearchPage/action";
import { watch as Category } from "./pages/Category/action";
import { watch as Activity } from "./pages/Activity/action";
import { watch as Person } from "./pages/Person/action";
import { watch as Deposite } from "./pages/DepositeLog/action";
import { watch as Password } from "./pages/Password/action";
import { watch as Login } from "./pages/Login/action";
// 组件中没写watcher，引用worker
import { actionStategy as Message } from "./pages/Message/action";
import { actionStategy as Feedback } from "./pages/Feedback/action";
import { actionStategy as FeedbackForm } from "./pages/FeedbackForm/action";
import { actionStategy as FeedbackReply } from "./pages/FeedbackReply/action";
import { actionStategy as FeedbackReplyForm } from "./pages/FeedbackReplyForm/action";

import { fork, take, select, call, put } from "redux-saga/effects";
import { takeEvery } from "redux-saga";

//redux saga 配置watcher，这样如果使用纯redux saga就不用在action（saga）文件中写下面的代码开启监听
function convert(actionStategy) {
  return Object.keys(actionStategy);
}

const watchCreator = actionStategy => {
  const actionList = convert(actionStategy);
  return function*() {
    while (true) {
      const { type, ...others } = yield take(actionList);
      try {
        const state = yield select(state => state);
        //这个type就是actionStategy数组中函数的名字，发一个请求，开启一个worker，就启动一个watcher
        const actionFn = actionStategy[type];
        if (!actionFn) continue;
        yield call(actionFn, state, others);
      } catch (e) {
        console.log(e);
      }
    }
  };
};

const rootWatch = actionStategys => {
  return actionStategys.map(actionStategy => {
    return fork(watchCreator(actionStategy));
  });
};

// 自己封装的类Dva框架
class Rluy {
  constructor() {
    this.sagaMiddleware = {};
    this.appReducers = {};
    this.actionStategy = [];
    this.effects = {};
  }
  onError(e) {
    console.log(e);
  }
  *rootWatcher() {
    while (1) {
      const { type, ...others } = yield take(this.actionStategy);
      const fn = this.effects[type];
      try {
        if (fn !== void 666) {
          yield call(fn, { fork, take, select, call, put }, others);
        }
      } catch (e) {
        this.onError(e);
      }
    }
  }
  *rootSaga() {
    yield all([fork(this.rootWatcher.bind(this))]);
  }

  model(Module) {
    const model = Module.default;

    const namespace = model.namespace;
    if (namespace === void 666) {
      throw new SyntaxError("模块缺少命名空间");
    }
    if (this.appReducers[namespace]) {
      throw new SyntaxError(`模块${namespace}已经存在`);
    }

    Object.keys(model.effects).forEach(key => {
      this.actionStategy.push(key);
      this.effects[key] = model.effects[key];
    });

    const modelState = model.state || {};
    const reducer = (state = modelState, { type, payload }) => {
      const func = model.reducers[type];
      if (func) {
        return func(state, { type, payload });
      }
      return state;
    };
    this.appReducers[namespace] = reducer;
  }
}

const app = new Rluy();
//配置Rluy
app.model(require("./pages/Address/Address"));
app.model(require("./pages/ImageViewer/ImageViewer"));
app.model(require("./pages/FeedbackForm/FeedbackForm"));
app.model(require("./pages/FreeItem/FreeItemModel"));
app.model(require("./pages/payment/payment"));
app.model(require("./pages/GoodState/product-detail"));
app.model(require("./pages/ProductHistory/product-history"));
app.model(require("./pages/Attachment/attachment"));
app.model(require("./pages/Loading/index"));
app.model(require("./pages/Charge/charge"));
app.model(require("./pages/Settle/remake_settle"));
app.model(require("./pages/Manifest/hank_model"));
app.model(require("./pages/Commission/model"));
app.model(require("./pages/CommissionWithdraw/model"));
// 在page下创建了新Model需要在这里配置

// Rluy 框架文档 https://github.com/Foveluy/Rluy#model 其实还有一些不一样

export const App = app;

//纯Redux saga 开启监听
export default function* rootSaga() {
  // 组件中的saga没写watcher，引用进来集体开启
  const watchList = rootWatch([
    Message,
    Feedback,
    FeedbackForm,
    FeedbackReply,
    FeedbackReplyForm
  ]);
  // 组件中写了watcher，引用进来watcher，使用fork，开启监听
  yield [
    fork(PriceList),
    fork(Detail),
    fork(Cart),
    fork(Manifest),
    fork(EventPage),
    fork(Home),
    fork(SearchPage),
    fork(Category),
    fork(Activity),
    fork(Person),
    fork(Deposite),
    fork(Password),
    fork(Login),
    fork(app.rootWatcher.bind(app)),
    ...watchList
  ];
}
