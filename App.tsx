/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import negotiateConnectionWithClientOffer from './src/utils/livestream/nogotiateConnectionWithClientOffer';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const stream = new MediaStream();

  const [remoteStream, setRemoteStream] = useState(stream);
  let peerConstraints = {
    iceServers: [
      {
        urls: 'stun:stun.cloudflare.com:3478',
      },
    ],
    bundlePolicy: 'max-bundle',
  };
  const peerConnection = useRef(new RTCPeerConnection(peerConstraints));

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const endpoint =
    'https://customer-uxkj6baef2fselfy.cloudflarestream.com/dc08c0938698c5c18a02c6bd8cac16e0/webRTC/play';
  useEffect(() => {
    peerConnection.current.addTransceiver('video', {
      direction: 'recvonly',
    });
    peerConnection.current.addTransceiver('audio', {
      direction: 'recvonly',
    });
    /**
     * When new tracks are received in the connection, store local references,
     * so that they can be added to a MediaStream, and to the <video> element.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
     */
    peerConnection.current.ontrack = event => {
      console.log(
        'ontrack',

        peerConnection.current.getTransceivers(),
      );
      const track = event.track;
      const currentTracks = stream.getTracks();
      const streamAlreadyHasVideoTrack = currentTracks.some(
        track => track.kind === 'video',
      );
      const streamAlreadyHasAudioTrack = currentTracks.some(
        track => track.kind === 'audio',
      );
      switch (track.kind) {
        case 'video':
          if (streamAlreadyHasVideoTrack) {
            break;
          }
          stream.addTrack(track);
          break;
        case 'audio':
          if (streamAlreadyHasAudioTrack) {
            break;
          }
          stream.addTrack(track);

          break;
        default:
          console.log('got unknown track ' + track);
      }
    };
    peerConnection.current.addEventListener('connectionstatechange', ev => {
      if (peerConnection.connectionState !== 'connected') {
        return;
      }
    });
    peerConnection.current.addEventListener('negotiationneeded', ev => {
      negotiateConnectionWithClientOffer(peerConnection.current, endpoint);
    });
    peerConnection.current?.addEventListener(
      'iceconnectionstatechange',
      event => {
        switch (peerConnection.current?.iceConnectionState) {
          case 'connected':
          case 'completed':
            setRemoteStream(stream);
            break;
        }
      },
    );
  }, []);
  console.log(remoteStream.toURL(), 'live');

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          {remoteStream && (
            <RTCView
              streamUrl={remoteStream?.toURL()}
              style={styles.stream}
              objectFit="cover"
            />
          )}
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  stream: {
    width: 200,
    height: 200,
  },
});

export default App;
