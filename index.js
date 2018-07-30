import React, {Component} from "react"
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
    Linking,
    ImageBackground,
    StatusBar,
    ToastAndroid,
    ScrollView
} from "react-native"

const {RNUpdateApp} = NativeModules
const RNFS = require("react-native-fs")
const {width, height} = Dimensions.get("window")
const isIOS = Platform.OS == "ios"


class RNUpdate extends Component {
    // 定义默认属性
    static defaultProps = {
        progressBarColor: "#f50",
        updateBoxWidth: 250,
        updateBoxHeight: 250,
        updateBtnHeight: 38,
        updateBtnText: "立即更新",
        theme: 1,
        bannerWidth: 250,
        bannerHeight: 120,
        bannerResizeMode: 'contain',
        successTips: "", // 包下载成功的提示
        errorTips: "", // 下载发生错误的提示
        CancelTips: "", // 用户取消升级的提示
        bannerImage: require('./theme/1/banner.png'),
        closeImage: require('./theme/1/close.png'),
    }

    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            modalVisible: false,
            desc: [], //更新说明
            fileSize: -1
        }

        this.jobId = 0 // 下载任务的id，用来停止下载
        this.fetchRes = {} // 远程请求更新的json数据


    }

    async componentWillMount() {
        if (this.props.onBeforeStart) {
            let res = await this.props.onBeforeStart()
            this.checkUpdate(res)
        }
    }

    checkUpdate(fetchRes) {
        try {
            this.fetchRes = fetchRes
            let {version, desc} = fetchRes

            if (!Array.isArray(desc)) {
                desc = [desc]
            }

            if (version > RNUpdateApp.appVersion) {
                try {
                    RNUpdateApp.getFileSize(res.url).then(fileSize => {
                        fileSize = Number(fileSize / 1024 / 1024).toFixed(2, 10)
                        this.setState({
                            modalVisible: true,
                            desc,
                            fileSize
                        })
                    })
                } catch (e) {
                    this.setState({
                        modalVisible: true,
                        desc
                    })
                }
            }
        } catch (e) {
            console.error('checkUpdate', e)
        }
    }

    errorTips = () => {
        ToastAndroid.show("安装失败",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
    }

    androidUpdate = () => {
        let _this = this
        const {url, fileName} = this.fetchRes
        // 按照目录/包名/文件名 存放
        const toFile = `${RNFS.DocumentDirectoryPath}/${fileName}`

        RNFS.downloadFile({
            fromUrl: url,
            toFile,
            progressDivider: 2,   // 节流
            begin(res) {
                _this.jobId = res.jobId   // 设置jobId，用于暂停和恢复下载任务
            },
            progress(res) {
                let progress = (res.bytesWritten / res.contentLength).toFixed(2, 10)
                // 此处 this 指向有问题，需要使用 _this
                _this.setState({
                    progress
                })
            }
        }).promise.then(response => {
            // 下载完成后
            this.hideModal()
            if (response.statusCode == 200) {
                console.log("FILES UPLOADED!") // response.statusCode, response.headers, response.body
                RNUpdateApp.install(toFile)
            } else {
                console.log("SERVER ERROR")
                // 提示安装失败，关闭升级窗口
                this.errorTips()
            }
        })
            .catch(err => {
                if (err.description == "cancelled") {
                    this.errorTips()
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

        let {iosUrl} = this.fetchRes
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

    componentWillUnmount() {
        this.hideModal()
    }

    renderBottom = () => {
        let {progress} = this.state
        let {
            progressBarColor,
            updateBtnHeight,
            updateBoxWidth,
            updateBtnText
        } = this.props
        if (progress) {
            return (
                <View style={styles.progressBar}>
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: progressBarColor,
                            height: 3,
                            width: progress * updateBoxWidth,
                        }}
                    />
                    <Text style={styles.updateBtnText}>下载中{parseInt(progress * 100, 10)}%</Text>
                </View>
            )
        }
        return (
            <TouchableOpacity onPress={this.updateApp}>
                <View style={styles.updateBtn}>
                    <Text style={styles.updateBtnText}>{updateBtnText}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderCloseBtn = () => {
        let {closeImage, updateBoxWidth, updateBoxHeight} = this.props
        return (
            <View
                style={{
                    position: "absolute",
                    right: (width - updateBoxWidth) / 2 - 16,
                    top: (height - updateBoxHeight) / 2 - 28,
                    zIndex: 1,
                    width: 32,
                    height: 32,
                    backgroundColor: "#e6e6e6",
                    borderRadius: 16
                }}
            >
                <TouchableOpacity
                    onPress={this.hideModal}
                    style={{
                        width: 32,
                        height: 32,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Image
                        source={closeImage}
                        style={{width: 20, height: 20}}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderBanner = () => {
        let {bannerImage, bannerWidth, bannerHeight, bannerResizeMode} = this.props
        return (
            <View style={{height: bannerHeight}}>
                <Image
                    style={{
                        width: bannerWidth,
                        height: bannerHeight,
                        resizeMode: bannerResizeMode
                    }}
                    source={bannerImage}>
                </Image>
            </View>
        )
    }

    render() {
        let {modalVisible, progress, desc, fileSize} = this.state
        let {updateBoxWidth, updateBoxHeight} = this.props
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                }}
            >
                <StatusBar
                    backgroundColor='rgb(38, 130, 73)'
                />
                <View style={styles.wrap}>
                    {this.renderCloseBtn()}
                    <View
                        style={[
                            styles.innerBox,
                            {width: updateBoxWidth, height: updateBoxHeight}
                        ]}>
                        {this.renderBanner()}
                        <View style={{width: updateBoxWidth, height: 85}}>
                            <ScrollView style={{paddingLeft: 10, paddingRight: 10}}>
                                <Text>文件大小：{fileSize}M</Text>
                                <Text>升级说明：</Text>
                                {desc &&
                                desc.map((d, i) => {
                                    return (
                                        <Text key={i}>{i + 1 + ". " + d}</Text>
                                    )
                                })}
                            </ScrollView>
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    innerBox: {
        backgroundColor: "#fff",
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
        alignItems: "center",
        justifyContent: 'center',

    },

})

export default RNUpdate
