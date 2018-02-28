import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { PageWithTab } from 'HOC/PageWithTab';
import { FlatListComponent } from 'HOC/FlatListWithSpecs';
import { ListItem } from 'component/ListItem';
import { TimeLine } from 'component/TimeLine';
import { timeSplit } from 'utils';



class Feedback extends FlatListComponent {
    CustomTabBarPress = (e, child, index) => {
        if (index === 0) {
            this.props.navigation.goBack();
        } else if (index === 1) {
            this.props.navigation.navigate('FeedbackForm');
        }
    }
    dataSource = () => this.props.feedbacks;

    onEndReached = () => {
        this.props.dispatch({ type: 'appendFeedback' })
    }
    keyExtractor = (item, index) => index;

    onItemPress = (item) => {
        this.props.navigation.navigate('FeedbackReply', { id: item.id })
    }
    renderItem = ({ item, index }) => {
        const { date, time } = timeSplit(item.createTime);
        const lastReplyTime = timeSplit(item.lastReplyTime);
        const content = (
            <View>
                <Text style={{ color: "#1890ff", marginBottom: 10 }}>{item.context}</Text>
                <TimeLine
                    date={date}
                    time={time}
                    SupportTicketType={item.supportTicketType}
                    priority={item.priority}
                />
                <Text style={{ color: "#fa8c16", fontSize: 10, marginTop: 10 }}>
                    {`${lastReplyTime.date === '无' ? '' : "上次回复时间：" + lastReplyTime.date}      ${lastReplyTime.time}`}
                </Text>
            </View>
        )
        return <ListItem
            title={`${item.title}`}
            content={content}
            onPress={() => this.onItemPress(item)}
        />
    }

    componentDidMount() {
        this.props.dispatch({ type: 'fetchFeedback' })
    }
}

const wrapper = PageWithTab(Feedback, ['返回', '我要反馈']);

const mapState = (state) => {
    return {
        ...state.Feedback
    }
}

export default connect(mapState)(wrapper);