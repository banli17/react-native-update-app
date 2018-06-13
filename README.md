# react-native-update-app

全自动 app 硬更新组件，简单易用。

## 预览

![](./preview/1.gif)

## 功能

- Android点击升级按钮全自动升级安装apk
- IOS点击升级按钮进入苹果商店下载
- 支持多主题(正在开发中...)，及自定义主题

## 安装

### 安装npm
```
npm install react-native-update-app --save
```

### 自动链接

```
react-native link react-native-update-app
react-native link react-native-fs    // 因为依赖react-native-fs
```

成功后，命令行窗口会有 `success` 字样提示。但是这里有个坑，它不会自动往`android/app/build.gradle`里加入下面这句，需要手动加上。

```
dependencies {
    ...
    compile project(':react-native-fs')
    compile project(':react-native-update-app')  // 添加这句
}
```

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
dependencies {
    ...
    // 添加下面2句
    compile project(':react-native-update-app')
    compile project(':react-native-fs')
}
```

## 使用

全自动检查版本进行更新升级，只需在app的入口文件中引入组件即可。

```javascript
import RNUpdate from "react-native-update-app"

// url 表示接口地址，在下面有详细介绍
render() {
    return (
        <View>
            <RNUpdate
                url={"http://banli17.xxx.com/u.json"}  // json url
                progressBarColor="#f50"
                updateBoxWidth={250},      // 选填，升级框的宽度
                updateBoxHeight={250}      // 选填，升级框的高度
                updateBtnHeight={38}       // 选填，升级按钮的高度
                bannerImage={require('./imgs/a.png')}  // 选填，换升级弹框图片
            />
        </View>
    )
}
```

`react-native-update-app`里自动发送了一个platform字段给后端url。值是`ios`或`android`。后端获取这个字段后，返回不同的`json`数据。

下面是 u.json 的数据格式：

```json
{
    "version": "1.1",
    "url": "http://banli17.xxx.com/apk/ck-2.0.0.apk",
    "fileName": "ck-2.0.0",
    "desc": ["新增了收藏功能", "优化了整体性能"]
}
```

*   `version`: app 版本号(`android/app/build.gradle`里`versionName`字段)，，如果大于当前版本号，则会弹出更新框
*   `url` : 如果是android，返回 android apk 下载地址，如果是ios，返回 ios应用商店的对应 url。(根据上面的platform字段区分)
*   `fileName`: apk 文件名
*   `desc`: 更新说明

## 注意事项

1. `react-native-fs`获取文件大小时，是根据请求头的`Content-Length`获取的。如果获取错误，则需要后端修改。