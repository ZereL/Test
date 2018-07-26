/**
 * 达人分享列表页面
 * 07/18创建
 */

import React, { Component } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { connect } from "react-redux";
import { TabHead } from "../../components/Tab";
import { Spin } from "../../components/Spin";

// 从Views文件夹拿来头部
import { HeaderWithLeftArrow } from "../../components/PageHeader";
import { ProductBox } from "../../components/ProductBox";
import { width, height, priceHelper } from "../../util";

class ExpertShare extends Component {
  // state = {};

  /********************* 生命周期函数 **********************/
  componentDidMount() {
    // 页面加载完成，请求API，加载数据
    this.props.dispatch({
      type: "fetchExpertShare"
    });
  }

  /********************* 事件handler **********************/
  /**
   * 返回主页方法
   */
  goBack = () => {
    this.props.navigation.goBack(null);
  };

  _keyExtractor = child => child.id;

  /********************* 渲染页面的方法 **********************/
  renderExpertShare = () => {
    return(
      <View>
      </View>
    )
  }

  /**
   * 渲染页面头部
   */
  renderHeader = () => {
    return (
      <View>
        <HeaderWithLeftArrow title="达人分享" onPress={this.goBack} />
      </View>
    );
  };

  /**
   * 渲染列表
   */
  renderList = () => {
    return (
      <FlatList
        data={this.props.expertShare}
        renderItem={this.renderExpertShare}
        initialNumToRender={6}
        keyExtractor={this._keyExtractor}
      />
    );
  };

  render() {
    console.log("达人分享中props", this.props);
    return (
      <View style={style.pageStyle}>
        {this.renderHeader()}
        {this.renderList()}
      </View>
    );
  }
}

// 页面的样式对象
const style = {
  pageStyle: {
    flex: 1,
    backgroundColor: "#fff"
  },
  defaultStyle: {
    alignItems: "center",
    justifyContent: "center"
  }
};

const mapStateToProps = applicationState => {
  return {
    ...applicationState.expertShare
  };
};

export default connect(mapStateToProps)(ExpertShare);
