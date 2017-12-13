import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Platform, FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { PageWithTab } from 'HOC/PageWithTab';
import { FlatListComponent } from 'HOC/FlatListWithSpecs';
import { ListItem } from 'component/ListItem';
import { TimeLine } from 'component/TimeLine';

import { MessageState } from './constant';
import { timeSplit } from 'utils';

class MessagePage extends FlatListComponent {
    componentDidMount() {
        this.props.dispatch({ type: 'fetchMessage' })
    }
    CustomTabBarPress = (e, child, index) => {
        this.props.navigation.goBack()
        this.props.dispatch({ type: 'updateMessage' })
    }
    onMessagePress = (id, messageId, memberId) => {
        this.props.dispatch({ type: 'MarkAsRead', id: messageId })
        this.props.navigation.navigate('GoodState', { id, messageId, memberId })
    }
    renderItem = ({ item, index }) => {
        const { date, time } = timeSplit(item.createTime);
        const content = (
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <TimeLine
                    date={date}
                    time={time}
                    SupportTicketType={''}
                    priority={''}
                />
                <Text style={{ color: '#ff4d4f', fontSize: 10 }}>{item.isRead ? '' : '未读'}</Text>
            </View>
        )
        return <ListItem
            title={item.title}
            extra={MessageState[item.messageType]}
            content={content}
            onPress={() => this.onMessagePress(item.dataId, item.id, item.memberId)}
        />
    }
    keyExtractor = (item) => item.id;
    dataSource = () => this.props.messages;
    onEndReached = () => {
        this.props.dispatch({ type: "appendMessage" })
    }
}

const MsgPageWrapper = PageWithTab(MessagePage, '返回')

const mapState = (state) => {
    return {
        ...state.Message
    }
}

export default connect(mapState, null)(MsgPageWrapper);