import React, { useContext } from "react";
import { useRouter, withRouter } from "next/router";
import getChimeContext from "../context/getChimeContext";
import LocalVideo from "./LocalVideo";
import MeetingStatusProvider from "../providers/MeetingStatusProvider";
import getMeetingStatusContext from "../context/getMeetingStatusContext";

const AttendeeView = (props) => {
  const { meetingStatus, errorMessage } = useContext(getMeetingStatusContext());
  return meetingStatus === 1 ? (
    <div>
      <LocalVideo />
      <br />
      <button onClick={props.endMeeting}>End Meeting</button>
      Attendee Page
    </div>
  ) : meetingStatus === 0 ? (
    <div>'Loading'</div>
  ) : (
    <div>'Failed'</div>
  );
};

function Attendee(props) {
  const { query } = props.router;
  const router = useRouter();
  const chime = useContext(getChimeContext());

  const endMeeting = async () => {
    await chime.leaveRoom(true);
    await router.push("/");
  };

  return (
    <MeetingStatusProvider query={query}>
      <AttendeeView endMeeting={endMeeting} />
    </MeetingStatusProvider>
  );
}

export default withRouter(Attendee);
