# react-native-update-app

全自动apk硬更新组件，简单易用。

## 预览

![](./preview/s1.png)

## 安装

`$ npm install react-native-update-app --save`

### 自动链接

`$ react-native link react-native-update-app`

### 手动链接

如果自动链接不行，请安装下面步骤进行手动链接。

#### iOS

1.  In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2.  Go to `node_modules` ➜ `react-native-update-app` and add `RNUpdateApp.xcodeproj`
3.  In XCode, in the project navigator, select your project. Add `libRNUpdateApp.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4.  Run your project (`Cmd+R`)<

#### Android

1.  Open up `android/app/src/main/java/[...]/MainActivity.java`

*   Add `import com.reactlibrary.RNUpdateAppPackage;` to the imports at the top of the file
*   Add `new RNUpdateAppPackage()` to the list returned by the `getPackages()` method

2.  Append the following lines to `android/settings.gradle`:
    ```
    include ':react-native-update-app'
    project(':react-native-update-app').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-update-app/android')
    ```
3.  Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
      compile project(':react-native-update-app')
    ```

## 使用

```javascript
import RNUpdateApp from "react-native-update-app"

// url 表示接口地址，在下面有详细介绍
render() {
	return (
		<View>
			<RNUpdateApp.Box url={"http://banli17.xxx.com/u.json"} />
		</View>
	)
}

```

下面是 u.json 的数据格式：

```json
{
    "version": "1.1",
    "totalSize": "12000000",  
    "fromUrl": "http://down.4vtk.com/apk/ck-2.0.0.apk",  
    "fileName": "ck-2.0.0.apk",  
    "iosUrl": "",
    "desc": [
        "新增了收藏功能",
        "优化了整体性能"
    ]
}
```

*   `version`: app 版本号，如果大于 app 当前版本号，则会弹出更新框
*   `totalSize`: android app 的大小，单位是 byte
*   `fromUrl` : android apk 下载地址
*   `fileName`: apk 文件名
*   `iosUrl`: ios appstore 的下载地址
*   `desc`: 更新说明
