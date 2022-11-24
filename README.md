# # Demo Livestream WebRTC with CloudFlare
## 🚀 Getting Started:

## Install the dependencies 
```
yarn install 
```
### For Android

Run the following command to run on android.

``` 
npx react-native run-android
```
Run the following command to generate apk on android.
```
yarn apk
```

### For iOS

Run the following commands to install pods and run the app on iPhone simulator

``` 
cd ios && pod install && cd ..
npx react-native run-ios
```
## Noted:
  * This demo is only work with react-native webrtc version 106.0.0-beta.6 or higher. Consider to 
    upgrade your react-native webrtc version if you want to use my repo as an instruction
  * Remember to modify these file to fix error relate to react-native web-rtc beta version on ios (hope they will fix it soon)
    * Change those line in node_modules/react-native-webrtc/ios/RCTWebRTC/SerializeUtils.m
     ```
      NSString *readyState;
      switch (track.readyState) {
        case RTCMediaStreamTrackStateLive:
            readyState = @"Live";
        case RTCMediaStreamTrackStateEnded:
            readyState = @"Ended";
      }
     ```
    * Into this to make it work
     ```
      NSString *readyState;
      switch (track.readyState) {
        case RTCMediaStreamTrackStateLive:
            readyState = @"live";
            break;
        case RTCMediaStreamTrackStateEnded:
            readyState = @"ended";
            break;
      }
      ```
     * You can use patch-package to modify node modules instantly (https://github.com/ds300/patch-package)
  


