import {createContext} from 'react';

import ChimeSdkWrapper from '../chime/SdkWrapper';

const context = createContext<ChimeSdkWrapper | null>(null);

export default function getChimeContext() {
  return context;
}
