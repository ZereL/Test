/**
 * 2017/10/26 方正 创建
 * 本页面是用于个人登陆
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Button, Modal, AsyncStorage, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.14


import { Grid } from '../../components/Grid';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // 4.4.2
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import LoginPage from '../Login'

import { header, Url } from '../../util'
import { ModalWrapper } from '../../HOC/ModalWrapper'

const { width, height } = Dimensions.get('window')

const Login = ModalWrapper(LoginPage);



export default class Profile extends React.Component {
    state = {
        isLogined: true,
        userName: '',
        userBalence: {
            aud: '',
            rmb: ''
        }
    }

    fetchBalance = () => {
        (async (that) => {
            const res = await fetch(Url + 'user/GetDepositBalance', {
                method: 'POST',
                headers: header.get(),
                body: "{}"
            })

            const json = await res.json()
            that.setState({
                userBalence: {
                    aud: json.data[1],
                    rmb: json.data[0]
                }
            })

        })(this)
    }

    componentDidMount() {
        this.fetchBalance()
    }

    /**
     * 处理用户6个方块的选择
     */
    onGridItemClick = (e, child, index) => {
        if (this.state.userName === '') {
            this.checkLogin()
            return
        }
        if (child.props.name === 'logout') {
            Alert.alert(
                '退出登陆',
                '您确定需要退出登陆吗?',
                [
                    { text: '取消', style: 'cancel' },
                    {
                        text: '确定退出', onPress: () => {
                            AsyncStorage.removeItem('token')
                                .then((res) => {
                                    this.checkLogin()
                                    this.setState({
                                        userBalence: ""
                                    })
                                })
                                .catch((res) => {
                                    //出错
                                })
                        }
                    },
                ],
                { cancelable: false }
            )
        } else {

            this.props.navigation.navigate(child.props.name)
        }
    }
    checkLogin = () => {
        AsyncStorage.multiGet(['token', 'name'])
            .then((res) => {

                if (res[0][1] === null) {
                    this.setState({
                        isLogined: false,
                        userName: '',
                        userBalence: {
                            aud: '',
                            rmb: ''
                        }
                    })
                } else {
                    header.set(res[0][1])
                    this.setState({
                        isLogined: true,
                        userName: res[1][1]
                    })
                }
            })
            .catch((res) => {
                //出错
            })
    }
    onLogin = (personInformation) => {

        if (personInformation.success === true) {


            header.set(personInformation.data.token)
            AsyncStorage.multiSet([
                ['token', personInformation.data.token],
                ['name', personInformation.data.name]
            ])
                .then((res) => {
                    this.setState({
                        userName: personInformation.data.name,
                        isLogined: true
                    })
                    this.props.refreshAll()
                    this.fetchBalance()
                })
                .catch((res) => {
                    //登陆失败
                })
        }
    }
    loginCancel = () => {
        this.setState({
            isLogined: true
        })
    }
    render() {
        return (
            <ScrollView style={headStyle.container}>
                <Head userName={this.state.userName} userBalence={this.state.userBalence} />
                <GridBody GridItemClick={this.onGridItemClick} />
                <Login visible={!this.state.isLogined} login={this.onLogin} loginCancel={this.loginCancel} />
            </ScrollView>
        )
    }
}



/**
 * 工具栏
 * 其中的name会在点击的时候传给GridItemClick函数
 * @parma:GridItemClick函数
 */
class GridBody extends Component {


    shouldComponentUpdate(nextProps) {
        //蠢静态的，永远不更新
        return false;
    }
    render() {
        const { GridItemClick } = this.props;
        const ToolItemSize = 33;
        const ToolItemColor = '#f79992';
        console.log('渲染GridBody')
        return (
            <Grid
                onPress={GridItemClick}
            >
                <ToolItem text='我的订单' name='Manifest' Image={<FontAwesome name="file-text-o" color={ToolItemColor} size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
                <ToolItem text='地址管理' name='Address' Image={<MaterialCommunityIcons color={ToolItemColor} name="map-marker-radius" size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
                <ToolItem text='预存款' name="Deposite" Image={<Ionicons name="logo-yen" color={ToolItemColor} size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
                <ToolItem text='个人信息' name='Person' Image={<MaterialCommunityIcons color={ToolItemColor} name="account-card-details" size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
                <ToolItem text='修改密码' name='Password' Image={<MaterialCommunityIcons color={ToolItemColor} name="lock" size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
                <ToolItem text='退出登陆' name='logout' Image={<Entypo name="log-out" color={ToolItemColor} size={ToolItemSize} style={{ backgroundColor: 'transparent' }} />} />
            </Grid>
        )
    }
}



/**
 * 个人信息
 */
class Head extends React.Component {

    shouldComponentUpdate(nextProps) {

        return nextProps.userName !== this.props.userName ||
            nextProps.userBalence !== this.props.userBalence
    }

    renderBalance = () => {
        const { userBalence } = this.props;
        if (userBalence.rmb === '' && userBalence.aud === '') {
            return '预存款：0'
        } else {
            return `预存款：${userBalence.rmb}，${userBalence.aud}`
        }
    }

    render() {
        const { userName, userBalence } = this.props;
        return (
            <View style={headStyle.head}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 60 / 2 }}
                        source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509577007&di=91baca655f3d432af3a0586dbfc5e834&imgtype=jpg&er=1&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01e50a55bee3b66ac7253f361e874b.jpg' }}
                    />
                    <Text style={{ margin: 8, color: '#fff3cf', backgroundColor: 'transparent' }}>欢迎您，{userName}</Text>
                    <Text style={{ margin: 8, color: '#fff3cf', backgroundColor: 'transparent' }}>{this.renderBalance()}</Text>
                    <Text style={{ margin: 8, color: '#fff3cf', backgroundColor: 'transparent' }}></Text>
                </View>
            </View>
        )
    }
}

/**
 * 个人工具
 */
const ToolItem = ({ text, Image, name }) => {
    this.name = name
    return (
        <View style={{ alignItems: 'center' }}>
            {Image}
            <Text style={{ marginTop: 8, backgroundColor: 'transparent' }}>{text}</Text>
        </View>
    )
}



const headStyle = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
        height: '100%',
    },
    head: {
        height: '60%',
        backgroundColor: '#f46e65',
    }
})