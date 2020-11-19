// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Store created meetings in a map so attendees can join by meeting title
const meetingTable = {};

// Create ans AWS SDK Chime object. Region 'us-east-1' is currently required.
// Use the MediaRegion property below in CreateMeeting to select the region
// the meeting is hosted in.
const chime = new AWS.Chime({ region: "us-east-1" });

// Set the AWS SDK Chime endpoint. The global endpoint is https://service.chime.aws.amazon.com.
chime.endpoint = new AWS.Endpoint(
  process.env.ENDPOINT || "https://service.chime.aws.amazon.com"
);

const endMeeting = async (res, title) => {
  await chime
    .deleteMeeting({
      MeetingId: meetingTable[title].Meeting.MeetingId,
    })
    .promise();
  res.statusCode = 200;
  res.json({});
};

const createAndJoinNewMeeting = async (res, title, name, region) => {
  if (!title || !name || !region) {
    throw new Error("Need parameters: title, name, region");
  }

  // Look up the meeting by its title. If it does not exist, create the meeting.
  if (!meetingTable[title]) {
    meetingTable[title] = await chime
      .createMeeting({
        // Use a UUID for the client request token to ensure that any request retries
        // do not create multiple meetings.
        ClientRequestToken: uuidv4(),
        MediaRegion: region,
        ExternalMeetingId: title.substring(0, 64),
      })
      .promise();
  }

  // Fetch the meeting info
  const meeting = meetingTable[title];

  // Create new attendee for the meeting
  const attendee = await chime
    .createAttendee({
      // The meeting ID of the created meeting to add the attendee to
      MeetingId: meeting.Meeting.MeetingId,
      ExternalUserId: `${uuidv4().substring(0, 8)}#${name}`.substring(0, 64),
    })
    .promise();

  // Return the meeting and attendee responses. The client will use these
  // to join the meeting.
  res.statusCode = 201;
  res.json({ Meeting: meeting, Attendee: attendee });
};

export default async (req, res) => {
  const {
    query: { title, name, region = "ap-south-1", end },
    method,
  } = req;

  if (end) {
    return endMeeting(res, title);
  } else {
    // http://localhost:3000/api/meeting/join?title=meet1&name=doe
    return createAndJoinNewMeeting(res, title, name, region);
  }
};
