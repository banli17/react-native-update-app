import React, { Component } from "react"
import {
    NativeModules,
    View,
    Modal,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    Alert,
    Platform,
    Linking
} from "react-native"

const { RNUpdateApp } = NativeModules
const RNFS = require("react-native-fs")
const { width, height } = Dimensions.get("window")
console.log(RNUpdateApp)
const isIOS = Platform.OS == "ios"

class Box extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            modalVisible: false,
            desc: [] //更新说明
        }

        this.jobId = 0 // 下载任务的id，用来停止下载
        this.fetchRes = {} // 远程请求更新的json数据
    }

    componentWillMount() {
        this.checkUpdate()
    }

    checkUpdate() {
        let { url } = this.props
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.fetchRes = res
                let { version, desc } = res
                console.log(res)
                if (version > RNUpdateApp.appVersion) {
                    // 需要更新，则弹出更新模态框
                    this.setState({
                        modalVisible: true,
                        desc
                    })
                }
            })
    }
    androidUpdate = () => {
        // 下载apk
        // {fromUrl: 'android apk download url', fileName: 'apk filename', version: 'app version', totalSize: 'app total size'}
        let _this = this
        const { fromUrl, fileName, totalSize } = this.fetchRes
        // 按照目录/包名/文件名 存放
        const toFile = `${RNFS.DocumentDirectoryPath}/${fileName}`

        console.log(toFile)
        RNFS.downloadFile({
            fromUrl,
            toFile,
            begin(res) {
                console.log(res)
                _this.jobId = res.jobId
            },
            progress(res) {
                let progress = (res.bytesWritten / totalSize).toFixed(2, 10)

                // 节流，此处 this 指向有问题，需要使用 _this
                if (progress > _this.state.progress) {
                    _this.setState({
                        progress
                    })
                }
            }
        })
            .promise.then(response => {
                if (response.statusCode == 200) {
                    console.log("FILES UPLOADED!") // response.statusCode, response.headers, response.body
                    RNUpdateApp.install(toFile)
                } else {
                    console.log("SERVER ERROR")
                    // 提示安装失败，关闭升级窗口
                }
                this.hideModal()
            })
            .catch(err => {
                if (err.description === "cancelled") {
                    // cancelled by user
                }
                this.hideModal()
            })
    }
    updateApp = () => {
        // 如果是android
        if (!isIOS) {
            this.androidUpdate()
            return
        }

        let { iosUrl } = this.fetchRes
        // 如果是ios，打开appstore连接
        Linking.openURL(iosUrl).catch(err =>
            console.error("An error occurred", err)
        )
    }
    // stopUpdateApp = () => {
    //     this.jobId && RNFS.stopDownload(this.jobId)
    // }
    hideModal = () => {
        this.setState({
            modalVisible: false
        })
        this.jobId && RNFS.stopDownload(this.jobId)
    }

    renderBottom = () => {
        let { progress } = this.state
        if (progress) {
            return (
                <View style={styles.progressBar}>
                    <View
                        style={{
                            backgroundColor: "#f50",
                            height: 38,
                            width: progress * 250
                        }}
                    />
                </View>
            )
        }
        return (
            <TouchableOpacity onPress={this.updateApp}>
                <View style={styles.updateBtn}>
                    <Text style={styles.updateBtnText}>升级</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        let { modalVisible, progress, desc } = this.state

        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {}}
            >
                <View style={styles.wrap}>
                    <View
                        style={{
                            position: "absolute",
                            right: (width - 250) / 2 - 16,
                            top: (height - 250) / 2 - 16,
                            zIndex: 2,
                            width: 32,
                            height: 32,
                            backgroundColor: "#e6e6e6",
                            borderRadius: 16,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <TouchableOpacity onPress={this.hideModal}>
                            <Image
                                source={require("./images/close.png")}
                                style={{ width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.innerBox}>
                        <View>
                            <Image
                                source={require("./images/1.png")}
                                style={{ width: 150, height: 120 }}
                            />
                        </View>
                        <View>
                            <Text>升级说明：</Text>
                            {desc &&
                                desc.map((d, i) => {
                                    return (
                                        <Text key={i}>{i + 1 + ". " + d}</Text>
                                    )
                                })}
                        </View>
                        {this.renderBottom()}
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        justifyContent: "center",
        width,
        height
    },
    innerBox: {
        backgroundColor: "#fff",
        width: 250,
        height: 250,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden"
    },
    updateBtn: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        width: 250,
        height: 38,
        alignItems: "center",
        justifyContent: "center"
    },
    updateBtnText: {
        fontSize: 13,
        color: "#f50"
    },
    progressBar: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        width: 250,
        height: 37,
        alignItems: "flex-start"
    }
})

RNUpdateApp.Box = Box

export default RNUpdateApp
