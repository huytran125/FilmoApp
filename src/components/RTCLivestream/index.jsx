import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {RTCPeerConnection, RTCView, MediaStream} from 'react-native-webrtc';
import negotiateConnectionWithClientOffer from '../../utils/livestream/negotiateConnectionWithClientOffer';

const windowWidth = Dimensions.get('window').width;
const RCTLivestream = props => {
  const {
    style,
    endpoint = 'https://customer-uxkj6baef2fselfy.cloudflarestream.com/25635cad214050e88ac319e6b14a985c/webRTC/play',
  } = props;
  const [remote, setRemote] = useState();
  let peerConstraints = {
    iceServers: [
      {
        urls: 'stun:stun.cloudflare.com:3478',
      },
    ],
    bundlePolicy: 'max-bundle',
  };
  const peerConnection = useRef(new RTCPeerConnection(peerConstraints));
  const remoteStream = useRef(null);

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
    remoteStream.current = new MediaStream(undefined);
    peerConnection.current.ontrack = event => {
      const track = event.track;
      const currentTracks = remoteStream.current.getTracks();
      const streamAlreadyHasVideoTrack = currentTracks.some(
        newTrack => newTrack.kind === 'video',
      );
      const streamAlreadyHasAudioTrack = currentTracks.some(
        newTrack => newTrack.kind === 'audio',
      );
      switch (track.kind) {
        case 'video':
          if (streamAlreadyHasVideoTrack) {
            break;
          }
          console.log('track', track);
          remoteStream?.current.addTrack(track);
          break;
        case 'audio':
          if (streamAlreadyHasAudioTrack) {
            break;
          }
          remoteStream?.current.addTrack(track);

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
            setRemote(remoteStream.current?.toURL());
            break;
        }
      },
    );
  }, [endpoint]);

  return (
    <View style={[styles.container, style]}>
      {remoteStream.current?.toURL() && (
        <RTCView
          objectFit="cover"
          mirror={true}
          streamURL={remote}
          style={styles.stream}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowWidth,
  },
  stream: {
    flex: 1,
    width: windowWidth,
    height: windowWidth,
    position: 'absolute',
  },
});

export default RCTLivestream;
