
package com.banli17;
import java.net.URL;
import java.net.URLConnection;
import java.net.HttpURLConnection;
import java.io.IOException;

import android.content.Intent;
import android.net.Uri;

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
    String cmd = "chmod 777 " + path;
    try {
        Runtime.getRuntime().exec(cmd);
    } catch (Exception e) {
        e.printStackTrace();
    }
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.setDataAndType(Uri.parse("file://" + path), "application/vnd.android.package-archive");
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