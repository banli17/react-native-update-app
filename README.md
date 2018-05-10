# react-native-update-app

全自动 apk 硬更新组件，简单易用。

## 预览

![](./preview/s1.png)

## 功能

- Android点升级按钮全自动升级安装apk，IOS点升级按钮进入苹果商店下载
- 支持多主题(正在开发中...)，及自定义主题

## 安装

### 安装npm
```
npm install react-native-update-app --save
```

### 自动链接

```
react-native link react-native-update-app
```

成功后，命令行窗口会有 `success` 字样提示。

### 手动链接

如果自动成功，则忽略这一步。如果自动链接不行，请安装下面步骤进行手动链接。

#### iOS

1.  In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2.  Go to `node_modules` ➜ `react-native-update-app` and add `RNUpdateApp.xcodeproj`
3.  In XCode, in the project navigator, select your project. Add `libRNUpdateApp.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4.  Run your project (`Cmd+R`)<

#### Android

1.  打开 `android/app/src/main/java/[...]/MainActivity.java`

*   添加 `import com.reactlibrary.RNUpdateAppPackage;`
*   在 `getPackages()`方法里添加 `new RNUpdateAppPackage()` 

2.  在 `android/settings.gradle` 加入:

```
include ':react-native-update-app'
project(':react-native-update-app').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-update-app/android')
```

3.  在 `android/app/build.gradle` 里加入:

```
compile project(':react-native-update-app')
```

## 使用

全自动检查版本进行更新升级，只需引入组件即可。

```javascript
import RNUpdate from "react-native-update-app"

// url 表示接口地址，在下面有详细介绍
render() {
    return (
        <View>
            <RNUpdate
                url={"http://banli17.xxx.com/u.json"}  // json url
                progressBarColor: "#f50",
                updateBoxWidth: 250,     // 升级框的宽度
                updateBoxHeight: 250,    // 升级框的高度
                updateBtnHeight: 38,     // 升级按钮的高度
                banner={require('./imgs/a.png')}  // 换升级弹框图片
            />
</View>
)
}
```

下面是 u.json 的数据格式：

```json
{
    "version": "1.1",
    "totalSize": "12000000",
    "fromUrl": "http://banli17.xxx.com/apk/ck-2.0.0.apk",
    "fileName": "ck-2.0.0.apk",
    "iosUrl": "",
    "desc": ["新增了收藏功能", "优化了整体性能"]
}
```

*   `version`: app 版本号，如果大于 app 当前版本号，则会弹出更新框
*   `totalSize`: android app 的大小，单位是 byte
*   `fromUrl` : android apk 下载地址
*   `fileName`: apk 文件名
*   `iosUrl`: ios appstore 的下载地址
*   `desc`: 更新说明
