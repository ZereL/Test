import React from "react";
import { View, TouchableOpacity, Text, Image, Alert } from "react-native";
import { centralization } from "../../style-util";
import { RoundButton } from "../../components/Button";

/**
 * 个人信息上半部分组件
 */
export class Head extends React.Component {
  // 转化money变量值 undefined到 0
  undefineToZero = money => {
    if (money !== void 666) {
      return money;
    } else {
      return " ";
    }
  };

  /**
   * 渲染存款
   */
  renderBalance = () => {
    const { userBalence } = this.props;
    if (userBalence.rmb === "" && userBalence.aud === "") {
      return "预存款：0";
    } else {
      return `预存款：${this.undefineToZero(
        userBalence.rmb
      )}  ${this.undefineToZero(userBalence.aud)}`;
    }
  };

  /**
   * 渲染佣金
   * 佣金功能
   * 18年6月加入
   */
  renderCommission = () => {
    const { userCommission } = this.props; //从props中拿到Commission， profile.js的head标签要加入userCommission={this.state.userCommission}
    if (userCommission.rmb === "" && userCommission.aud === "") {
      //return '我的佣金：0'
    } else {
      return `我的佣金：¥${this.undefineToZero(
        userCommission.rmb
      )}  $${this.undefineToZero(userCommission.aud)}`;
    }
  };

  /**
   * 账户充值方法
   */
  recharge = currency => {
    const navigate = this.props.navigation.navigate;
    Alert.alert("充值", "请选择要充值到哪个账户", [
      {
        text: "充值人民币账户",
        onPress: () => {
          navigate("Charge", { currency: "RMB" });
        },
        style: "default"
      },
      {
        text: "充值澳币账户",
        onPress: () => {
          navigate("Charge", { currency: "AUD" });
        },
        style: "default"
      },
      {
        text: "取消",
        onPress: () => {},
        style: "cancel"
      }
    ]);
  };

  /**
   * 点击佣金旁边的查看按钮，跳转页面到佣金列表页面
   */
  commissionHandler = () => {
    const navigate = this.props.navigation.navigate;
    navigate("CommissionList");
  };

  render() {
    const { userName, userBalence, Message } = this.props;
    const headTextStyle = {
      margin: 8,
      color: "#fff3cf",
      backgroundColor: "transparent"
    };

    return (
      <View
        style={{
          height: 250,
          backgroundColor: "#f46e65"
        }}
      >
        <Message {...this.props} />
        <View style={centralization({ flex: 1 })}>
          <TouchableOpacity onPress={() => navigate("Person")}>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 60 / 2
              }}
              source={{
                uri:
                  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509577007&di=91baca655f3d432af3a0586dbfc5e834&imgtype=jpg&er=1&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01e50a55bee3b66ac7253f361e874b.jpg"
              }}
            />
          </TouchableOpacity>
          <Text style={headTextStyle}>欢迎您，{userName}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={headTextStyle}>{this.renderBalance()}</Text>
            <RoundButton backgroundColor="#9254de" onPress={this.recharge}>
              <Text style={{ ...headTextStyle, margin: 0, fontSize: 10 }}>
                充值
              </Text>
            </RoundButton>
          </View>
          {this.props.userCommission ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={headTextStyle}>{this.renderCommission()}</Text>
              <RoundButton
                backgroundColor="#9254de"
                onPress={this.commissionHandler}
              >
                <Text style={{ ...headTextStyle, margin: 0, fontSize: 10 }}>
                  查看
                </Text>
              </RoundButton>
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}
