// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { VideoTileState } from 'amazon-chime-sdk-js';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import getChimeContext from '../context/getChimeContext';


export default function LocalVideo() {
  const [enabled, setEnabled] = useState(true);
  const chime = useContext(getChimeContext());
  const videoElement = useRef(null);

  useLayoutEffect(() => {
    chime.audioVideo.addObserver({
      videoTileDidUpdate: (tileState: VideoTileState): void => {
        // if (
        //   !tileState.boundAttendeeId ||
        //   !tileState.localTile ||
        //   !tileState.tileId ||
        //   !videoElement.current
        // ) {
        //   console.log('wow, I am returning from here');
        //   return;
        // }
        // console.log('wow, binding video element');
        console.log('wow video element', videoElement);
        chime?.audioVideo?.bindVideoElement(
          tileState.tileId,
          (videoElement.current as unknown) as HTMLVideoElement
        );
        setEnabled(tileState.active);
      }
    });
  }, []);

  const onClick = async () => {
    try {
      if (!chime?.currentVideoInputDevice) {
        throw new Error('currentVideoInputDevice does not exist');
      }
      await chime?.chooseVideoInputDevice(
          chime?.currentVideoInputDevice
      );
      chime?.audioVideo?.startLocalVideoTile();
    } catch(e){
      console.error(e);
    }
  }

  return (
      <div>
        <video ref={videoElement} className="video" style={{height : '200px', width : '200px'}} />
        <button onClick={onClick}>Enable Video</button>
      </div>
  );
}
