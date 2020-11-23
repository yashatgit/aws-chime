import React, {useState} from 'react';
import {
    ControlBar,
    ControlBarButton,
    Camera,
    Phone,
    useLocalVideo,
    useMeetingManager
} from 'amazon-chime-sdk-component-library-react';
import {useRouter} from "next/router";

const Controls = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const router = useRouter();
    const { toggleVideo } = useLocalVideo();
    const meetingManager = useMeetingManager();
    const cameraButtonProps = {
        icon: cameraActive ? <Camera /> : <Camera disabled />,
        onClick: async () => { await toggleVideo(); setCameraActive(!cameraActive);},
        label: 'Camera'
    };
    const hangUpButtonProps = {
        icon: <Phone />,
        onClick: async () => {
            await meetingManager.leave();
            await router.push('/')
        },
        label: 'End'
    };
    return <ControlBar showLabels layout="bottom" className="absolute">
        <ControlBarButton {...cameraButtonProps}/>
        <ControlBarButton {...hangUpButtonProps}/>
    </ControlBar>
}

export default Controls;
