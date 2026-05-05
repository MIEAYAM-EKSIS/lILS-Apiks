import JSZip from 'jszip'

interface APKConfig {
  appName: string
  appUrl: string
  iconBase64: string | null
}

// Template AndroidManifest.xml
const getManifest = (appName: string) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nebolus.${appName.toLowerCase().replace(/\s/g, '')}"
    android:versionCode="1"
    android:versionName="1.0">
    
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:usesCleartextTraffic="true"
        android:theme="@style/AppTheme">
        
        <activity android:name=".MainActivity"
            android:configChanges="orientation|screenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
    </application>
</manifest>`

// Template MainActivity.java
const getMainActivity = (appUrl: string) => `package com.nebolus.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webView);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl("${appUrl}");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`

// Template activity_main.xml
const getLayout = () => `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
        
</LinearLayout>`

// Generate simple 1x1 pixel PNG as fallback icon
const generateFallbackIcon = async (): Promise<Buffer> => {
  // Minimal PNG (1x1 transparent pixel)
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  return Buffer.from(pngBase64, 'base64')
}

export async function generateAPK(config: APKConfig): Promise<Buffer> {
  const zip = new JSZip()
  
  // Add AndroidManifest.xml
  zip.file("AndroidManifest.xml", getManifest(config.appName))
  
  // Add Java source
  zip.file("src/com/nebolus/app/MainActivity.java", getMainActivity(config.appUrl))
  
  // Add layout
  zip.file("res/layout/activity_main.xml", getLayout())
  
  // Add icon
  let iconBuffer: Buffer
  if (config.iconBase64) {
    const base64Data = config.iconBase64.replace(/^data:image\/\w+;base64,/, '')
    iconBuffer = Buffer.from(base64Data, 'base64')
  } else {
    iconBuffer = await generateFallbackIcon()
  }
  
  // Add icon to multiple mipmap folders
  const sizes = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']
  for (const size of sizes) {
    zip.file(`res/mipmap-${size}/ic_launcher.png`, iconBuffer)
    zip.file(`res/mipmap-${size}/ic_launcher_round.png`, iconBuffer)
  }
  
  // Add resources
  zip.file("res/values/strings.xml", `<resources><string name="app_name">${config.appName}</string></resources>`)
  zip.file("res/values/styles.xml", `<resources><style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar"/></resources>`)
  
  // Generate ZIP (this would need actual compilation in production)
  // For demo, we're creating a structured ZIP that represents an APK structure
  const apkZip = await zip.generateAsync({ type: 'nodebuffer' })
  
  return apkZip
}