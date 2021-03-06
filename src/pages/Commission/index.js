/**
 * 佣金来源详情页面
 * 06/18创建
 */

import React, { Component } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
//每行的渲染样式
import CommissionRow from "./View/CommissionRow";
// 从manifest页面拿来头部
import { HeaderWithLeftArrow } from "./View/CommissionHeader";
// 帮助类里面拿到屏幕的长宽
import { width, height } from "../../util";
// 拿到底部两个按钮的HOC
// import { PageWithTab } from "../../HOC/PageWithTab";

import { Spin, SpinScreen } from '../../components/Spin';


// 声明一个变量pageIndex记录目前的页数
let pageIndex = 0;
class Commission extends Component {
  componentDidMount() {
    // 这个请求在给flatList加了Height之后就不需要了，因为有了height，
    // 第一次加载组件的时候没有数据，onEndReached函数会自动执行，加载第一页数据。不用在这里拿数据了
    // //页面加载完成，第一次获取数据，
    // this.props.dispatch({
    //   type: "fetchCommissionList",
    //   payload: { pageIndex } //payLoad必须是对象
    // });
  }

  /**
   * 返回主页方法
   */
  goBack = () => {
    this.props.navigation.goBack(null);
  };

  /**
   * 页面加载到底,触发请求渲染下一页
   */
  endReachHandler = () => {
    pageIndex++;
    console.log("pagIndex", pageIndex);
    this.props.dispatch({
      type: "fetchCommissionList",
      payload: { pageIndex } //payload必须是对象
    });
  };

  /**
   * 申请提现按钮
   * 弹出警告栏选择提现方法
   */
  withdrawHandler = () => {
    Alert.alert(
      "选择提现账户",
      "",
      [
        {
          text: "预存款",
          onPress: () => {
            //{ ...this.props.commission }这个第二个参数就是传入的props
            //this.props.navigation.navigate("WithdrawToDeposit", { ...this.props.commission });
            this.props.navigation.navigate("WithdrawToDeposit", {});
          }
        },
        {
          text: "微信",
          onPress: () => {
            this.props.navigation.navigate("WithdrawToWeChat", {});
          }
        },
        {
          text: "支付宝",
          onPress: () => {
            this.props.navigation.navigate("WithdrawToAlipay", {});
          }
        },
        {
          text: "中国境内银行",
          onPress: () => {
            this.props.navigation.navigate("WithdrawToCNBank", {});
          }
        },
        {
          text: "境外银行-澳币",
          onPress: () => {
            this.props.navigation.navigate("WithdrawToAUBank", {});
          }
        },
        { text: "取消" }
      ],
      { cancelable: false }
    );
  };

  /**
   * 渲染申请提现按钮
   */
  renderApplyWithDraw = () => {
    return (
      <TouchableOpacity onPress={this.withdrawHandler}>
        <Text
          style={{
            textAlign: "center",
            backgroundColor: "White",
            width: width / 2,
            padding: 15
          }}
        >
          申请提现
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * 渲染没有可提佣金按钮
   */
  renderNoWithDraw = () => {
    return (
      <TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            backgroundColor: "White",
            width: width / 2,
            padding: 15
          }}
        >
          没有可提佣金
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * 渲染底部按钮
   */
  renderButtons = () => {
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          height: 44
        }}
      >
        {this.props.Profile.getIsWithdrawAvailable()
          ? this.renderApplyWithDraw()
          : this.renderNoWithDraw()}
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("CommissionWithdraw");
          }}
        >
          <Text
            style={{
              textAlign: "center",
              width: width / 2,
              padding: 15,
              backgroundColor: "#ff7875"
            }}
          >
            提现记录
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * 后续可能需要加入的ListFooterComponent用来下拉刷新的时候提示用户
   */
  renderFooter() {
    //   if (!this.props.commission) return <SpinScreen />
  }

  render() {
    // 渲染主题页面
    // console.log("佣金来源详情this.props.commission", this.props.commission);
    // console.log("佣金来源详情this.props.profile", this.props.Profile);
    // console.log(
    //   "佣金来源详情是否有佣金可提",
    //   this.props.Profile.getIsWithdrawAvailable()
    // );
    // console.log("佣金来源详情his.props", this.props);
    return (
      <View
        style={{
          flexDirection: "column",
          height: height
        }}
      >
        <View>
          <HeaderWithLeftArrow title="佣金来源详情" onPress={this.goBack} />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.commission || []}
            renderItem={CommissionRow}
            keyExtractor={item => item.id}
            onEndReached={this.endReachHandler}
            onEndReachedThreshold={0.1}
            pageSize={15}
          />
        </View>
        <View>{this.renderButtons()}</View>
      </View>
    );
  }
}
//<View>{this.renderButtons()}</View>
//<View>{this.renderApplyWithDraw()}</View>

function mapStateToProps(state) {
  return {
    // 从application level state 中拿到 commission state
    ...state.commission
  };
}

// 没有用封装好的PageWithTab因为涉及一个判断，有没有佣金显示的button不一样
// const Wrapper = PageWithTab(Commission,["无可提佣金", "发给客户"],["white", "#ff7875"]);

export default connect(mapStateToProps)(Commission);
