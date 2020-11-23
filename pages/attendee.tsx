import React, {useEffect} from "react";
import { withRouter } from "next/router";
import {
    useMeetingManager,
    useMeetingStatus,
    VideoTileGrid,
    MeetingStatus,
    Heading,
    Flex,
    Spinner,
} from 'amazon-chime-sdk-component-library-react';
import Controls from '../components/Controls';

const NoRemoveVideo = <Flex container justifyContent="center" alignItems="center"><Heading level={4}>No one is sharing their video</Heading></Flex>;

const MeetingStatusLabels = {
    [MeetingStatus.Loading] : 'Loading',
    [MeetingStatus.Failed] : 'Failed',
    [MeetingStatus.Ended] : 'Ended',
    [MeetingStatus.Succeeded] : 'Succeeded',
}
function Attendee(props) {
  const { query } = props.router;
  const status = useMeetingStatus();
  const meetingManager = useMeetingManager();
  useEffect(() => {
      const startMeeting = async () => {
          const data = await fetch(`/api/meeting?mode=join&meetingTitle=${query.title}&name=${query.name}`).then(res => res.json());
          const joinData = {
              meetingInfo: data.Meeting,
              attendeeInfo: data.Attendee
          };

          // Use the join API to create a meeting session
          await meetingManager.join(joinData);

          // At this point you can let users setup their devices, or start the session immediately
          await meetingManager.start();
      }
      startMeeting();
  }, []);

  return (
    <Flex className="full-view" container justifyContent="center" alignItems="center">
        {status !== 1? <React.Fragment><Heading level={4}>{MeetingStatusLabels[status]}</Heading><Spinner height="5rem" width="5rem"/></React.Fragment> :
            <React.Fragment>
                <div style={{paddingBottom : '76px'}} className="full-space">
                    <VideoTileGrid noRemoteVideoView={NoRemoveVideo}/>
                </div>
                <Controls />
            </React.Fragment>
        }
    </Flex>
  );
}

export default withRouter(Attendee);
