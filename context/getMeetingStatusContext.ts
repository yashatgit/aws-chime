import React from 'react';

const context = React.createContext<{
  meetingStatus: 0 | 1 | 2;
  errorMessage?: string;
}>({
  meetingStatus: 0
});

export default function getMeetingStatusContext() {
  return context;
}
