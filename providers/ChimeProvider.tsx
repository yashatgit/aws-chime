import React, { useEffect, useState } from "react";

import SdkWrapper from "../chime/SdkWrapper";
import getChimeContext from "../context/getChimeContext";

function ChimeProvider(props) {
  const { children } = props;
  const [sdkWrapper, setSdkWrapper] = useState(null);
  useEffect(() => {
    console.log("set SdkWrapper");
    setSdkWrapper(new SdkWrapper());
  }, []);

  const ChimeContext = getChimeContext();

  return (
    <ChimeContext.Provider value={sdkWrapper}>{children}</ChimeContext.Provider>
  );
}

export default ChimeProvider;
