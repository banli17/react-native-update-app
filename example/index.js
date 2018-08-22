import React, {Component} from "react"

import {
    View,
} from "react-native"
import RNUpdate from "react-native-update-app"

class _App extends Component {

    constructor(props) {
        super(props)
    }

    // auto update
    autoCheckHardUpdate = async () => {
        // you can like this
        // let res = await request()
        let res = {
            "data": {
                "version": "1.7",
                "filename": "wechat",
                "url": "http://222.169.40.2:8666/data/wisegame/1d68c0b23cfdf238/weixin_1340.apk?business_id=9034&task_id=6637471880647409681",
                "desc": "修复bug"
            }, "error": {"code": 0}
        }

        if (res) {
            return res.data
        }
    }

    // press update
    onHanderUpdate = ()=>{
        // you can like this
        // let res = await request()
        let res = {
            "data": {
                "version": "1.7",
                "filename": "wechat",
                "url": "http://222.169.40.2:8666/data/wisegame/1d68c0b23cfdf238/weixin_1340.apk?business_id=9034&task_id=6637471880647409681",
                "desc": "修复bug"
            }, "error": {"code": 0}
        }
        global.$RNUpdate.updateApp(res.data)
    }

    render() {
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <RNUpdate
                ref={r => global.$RNUpdate = r}
                onBeforeStart={this.autoCheckHardUpdate}
                progressBarColor="#f50"/>
            <Button title='update' onPress={this.onHanderUpdate}></Button>
        </View>
    }
}