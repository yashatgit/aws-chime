import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
    MeetingSession,
    AudioVideoFacade,
}  from 'amazon-chime-sdk-js';

type DeviceType = {label: string; value: string};

class SdkWrapper{
    title: string | null = null;
    meetingSession: MeetingSession | null = null;
    configuration: MeetingSessionConfiguration | null = null;
    audioVideo: AudioVideoFacade | null = null;
    audioInputDevices: DeviceType[];
    audioOutputDevices: DeviceType[];
    videoInputDevices: DeviceType[];
    currentAudioInputDevice: DeviceType | null = null;
    currentAudioOutputDevice: DeviceType | null = null;
    currentVideoInputDevice: DeviceType | null = null;
    initializeSdkWrapper = async () => {
        this.meetingSession = null;
        this.audioVideo = null;
        this.title = null;
        this.currentAudioInputDevice = null;
        this.currentAudioOutputDevice = null;
        this.currentVideoInputDevice = null;
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];
        this.configuration = null;
    };
    createMeetingSession = async (mode, title, name) => {
        const {Meeting, Attendee} = await fetch(`/api/meeting?mode=${mode}&meetingTitle=${title}&name=${name}`).then(res => res.json());
        const logger = new ConsoleLogger('ChimeMeetingLogs', LogLevel.INFO);
        const deviceController = new DefaultDeviceController(logger);
        this.configuration = new MeetingSessionConfiguration(Meeting, Attendee);
        this.meetingSession = new DefaultMeetingSession(this.configuration, logger, deviceController);
        this.audioVideo = this.meetingSession.audioVideo;
        this.title=title;
        await this.initialiseDevices();
        console.log('meeting created');
    };
    initialiseDevices = async () => {
        this.audioInputDevices = [];
        (await this.audioVideo?.listAudioInputDevices()).forEach(
            (mediaDeviceInfo: MediaDeviceInfo) => {
                this.audioInputDevices.push({
                    label: mediaDeviceInfo.label,
                    value: mediaDeviceInfo.deviceId
                });
            }
        );
        this.audioOutputDevices = [];
        (await this.audioVideo?.listAudioOutputDevices()).forEach(
            (mediaDeviceInfo: MediaDeviceInfo) => {
                this.audioOutputDevices.push({
                    label: mediaDeviceInfo.label,
                    value: mediaDeviceInfo.deviceId
                });
            }
        );
        this.videoInputDevices = [];
        (await this.audioVideo?.listVideoInputDevices()).forEach(
            (mediaDeviceInfo: MediaDeviceInfo) => {
                this.videoInputDevices.push({
                    label: mediaDeviceInfo.label,
                    value: mediaDeviceInfo.deviceId
                });
            }
        );
        console.log('devices updated');
    };
    joinRoom = async (element: HTMLAudioElement | null): Promise<void> => {
        if (!element) {
            console.error(new Error(`element does not exist`));
            return;
        }

        window.addEventListener(
            'unhandledrejection',
            (event: PromiseRejectionEvent) => {
                console.error(event.reason);
            }
        );

        console.log('in room joining', this.audioVideo);

        const audioInputs = await this.audioVideo?.listAudioInputDevices();
        if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
            this.currentAudioInputDevice = {
                label: audioInputs[0].label,
                value: audioInputs[0].deviceId
            };
            await this.audioVideo?.chooseAudioInputDevice(audioInputs[0].deviceId);
        }

        const audioOutputs = await this.audioVideo?.listAudioOutputDevices();
        if (audioOutputs && audioOutputs.length > 0 && audioOutputs[0].deviceId) {
            this.currentAudioOutputDevice = {
                label: audioOutputs[0].label,
                value: audioOutputs[0].deviceId
            };
            await this.audioVideo?.chooseAudioOutputDevice(audioOutputs[0].deviceId);
        }

        const videoInputs = await this.audioVideo?.listVideoInputDevices();
        if (videoInputs && videoInputs.length > 0 && videoInputs[0].deviceId) {
            this.currentVideoInputDevice = {
                label: videoInputs[0].label,
                value: videoInputs[0].deviceId
            };
            await this.audioVideo?.chooseVideoInputDevice(null);
        }

        console.log('wow', this.currentVideoInputDevice);

        // this.publishDevicesUpdated();

        await this.audioVideo?.bindAudioElement(element);
        this.audioVideo?.start();
        console.log('room joined');
    };
    leaveRoom = async (end: boolean): Promise<void> => {
        console.log('inside ending');
        try {
            console.log(this.audioVideo);
            this.audioVideo?.stop();
        } catch (error) {
            console.error(error);
        }
        console.log('in here');

        try {
            if (end && this.title) {
                console.log('ending meeting');
                await fetch(
                    `/api/meeting?mode=end&meetingTitle=${encodeURIComponent(this.title)}`,
                    {
                        method: 'POST'
                    }
                );
            }
        } catch (error) {
            console.error(error);
        }

        await this.initializeSdkWrapper();
    };
    chooseVideoInputDevice = async (device: DeviceType) => {
        try {
            await this.audioVideo?.chooseVideoInputDevice(device.value);
            this.currentVideoInputDevice = device;
        } catch (error) {
            console.error(error);
        }
    };
}

export default SdkWrapper;
