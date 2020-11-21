// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  MeetingSessionStatus,
  MeetingSessionStatusCode,
} from "amazon-chime-sdk-js";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import getChimeContext from "../context/getChimeContext";
import getMeetingStatusContext from "../context/getMeetingStatusContext";

export default function MeetingStatusProvider(props) {
  const MeetingStatusContext = getMeetingStatusContext();
  const router = useRouter();
  const { children } = props;
  const chime = useContext(getChimeContext());
  const [meetingStatus, setMeetingStatus] = useState<{
    meetingStatus: 0 | 1 | 2; // loading | started | failed
    errorMessage?: string;
  }>({
    meetingStatus: 0,
  });
  const query = props.query;
  const audioElement = useRef(null);

  useEffect(() => {
    const startMeeting = async () => {
      try {
        await chime?.createMeetingSession(query.mode, query.meetId, query.name);

        setMeetingStatus({
          meetingStatus: 1,
        });

        chime?.audioVideoFacade?.addObserver({
          audioVideoDidStop: (sessionStatus: MeetingSessionStatus): void => {
            if (
              sessionStatus.statusCode() ===
              MeetingSessionStatusCode.AudioCallEnded
            ) {
              router.push("/");
              chime?.leaveRoom(true);
            }
          },
        });

        await chime?.joinRoom(audioElement.current);
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setMeetingStatus({
          meetingStatus: 2,
          errorMessage: error.message,
        });
      }
    };
    startMeeting();
  }, []);

  return (
    <MeetingStatusContext.Provider value={meetingStatus}>
      {/* eslint-disable-next-line */}
      <audio ref={audioElement} style={{ display: "none" }} />
      {children}
    </MeetingStatusContext.Provider>
  );
}
