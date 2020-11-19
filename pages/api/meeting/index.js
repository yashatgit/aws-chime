const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Store created meetings in a map so attendees can join by meeting meetingTitle
const meetingTable = {};

// Create ans AWS SDK Chime object. Region 'us-east-1' is currently required.
// Use the MediaRegion property below in CreateMeeting to select the region
// the meeting is hosted in.
const chime = new AWS.Chime({ region: "us-east-1" });

// Set the AWS SDK Chime endpoint. The global endpoint is https://service.chime.aws.amazon.com.
chime.endpoint = new AWS.Endpoint(
  process.env.ENDPOINT || "https://service.chime.aws.amazon.com"
);

const createMeeting = async (meetingTitle, region) => {
  if (!meetingTitle) {
    throw new Error("Need parameters: meetingTitle");
  }

  // Look up the meeting by its meetingTitle. If it does not exist, create the meeting.
  if (!meetingTable[meetingTitle]) {
    meetingTable[meetingTitle] = await chime
      .createMeeting({
        // Use a UUID for the client request token to ensure that any request retries
        // do not create multiple meetings.
        ClientRequestToken: uuidv4(),
        MediaRegion: region,
        ExternalMeetingId: meetingTitle.substring(0, 64),
      })
      .promise();
  }

  // Fetch the meeting info
  const meeting = meetingTable[meetingTitle];
  console.log(meetingTable);
  return meeting;
};

const createAttendee = async (meetingTitle, name) => {
  // Fetch the meeting info
  const meeting = meetingTable[meetingTitle];
  console.log({ meetingTable, meeting });

  if (!meeting || !name) {
    throw new Error("Create a meeting first.");
  }

  // Create new attendee for the meeting
  const attendee = await chime
    .createAttendee({
      // The meeting ID of the created meeting to add the attendee to
      MeetingId: meeting.Meeting.MeetingId,
      ExternalUserId: `${uuidv4().substring(0, 8)}#${name}`.substring(0, 64),
    })
    .promise();

  return attendee;
};

const endMeeting = async (meetingTitle) => {
  if (!meetingTitle) {
    throw new Error("Missing parameter: meetingTitle");
  }
  return await chime
    .deleteMeeting({
      MeetingId: meetingTable[meetingTitle].Meeting.MeetingId,
    })
    .promise();
};

export default async (req, res) => {
  const {
    query: { meetingTitle, name, region = "ap-south-1", mode },
  } = req;

  if (!mode) {
    throw new Error("Need parameters: mode");
  }

  if (mode === "createMeeting") {
    // http://localhost:3000/api/meeting?mode=createMeeting&meetingTitle=meet1
    const meeting = await createMeeting(meetingTitle, region);
    res.statusCode = 201;
    res.json({ meeting: meeting });
  } else if (mode === "createAttendee") {
    // http://localhost:3000/api/meeting?mode=createAttendee&meetingTitle=meet1&name=john
    const attendee = await createAttendee(meetingTitle, name);
    res.statusCode = 201;
    res.json({ attendee: attendee });
  } else if (mode === "end") {
    // http://localhost:3000/api/meeting?mode=end
    const endResponse = await endMeeting(meetingTitle);
    res.statusCode = 201;
    res.json(endResponse);
  }
};
