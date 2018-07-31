
package com.banli17;
import java.net.URL;
import java.net.URLConnection;
import java.net.HttpURLConnection;
import java.io.IOException;
import java.lang.reflect.Method;

import android.support.v4.content.FileProvider;
import android.os.Environment;
import android.os.StrictMode;

import android.util.Log;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import java.io.File;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import java.util.HashMap;
import java.util.Map;

public class RNUpdateAppModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String APP_VERSION = "appVersion";
    private static final String APP_BUILD = "buildVersion";
    private static final String APP_ID = "bundleIdentifier";

    public RNUpdateAppModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNUpdateApp";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        final PackageManager packageManager = this.reactContext.getPackageManager();
        final String packageName = this.reactContext.getPackageName();
        try {
            constants.put(APP_VERSION, packageManager.getPackageInfo(packageName, 0).versionName);
            constants.put(APP_BUILD, packageManager.getPackageInfo(packageName, 0).versionCode);
            constants.put(APP_ID, packageName);
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
        return constants;
    }


@ReactMethod
public void install(String path) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    Uri apkUri = null;
    File apkFile = new File(Uri.parse("file://" + path).getPath());
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {

        apkUri = FileProvider.getUriForFile(reactContext, reactContext.getApplicationContext().getPackageName() +".fileprovider", apkFile);

        //添加这一句表示对目标应用临时授权该Uri所代表的文件
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
    } else {
        apkUri = Uri.parse("file://" + path);
    }
    intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
    reactContext.startActivity(intent);
}

@ReactMethod
public void getFileSize(String path,Promise promise) throws Exception{
    URL url = new URL(path);
    HttpURLConnection conn = null;
    try {
        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("HEAD");
        conn.getInputStream();
        promise.resolve("" + conn.getContentLength());

    } catch (IOException e) {
        promise.reject("-1");
    } finally {
        conn.disconnect();
    }
}

}