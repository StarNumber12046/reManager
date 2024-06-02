import { SideBar } from '@renderer/components/SideBar'
import { RootContext } from '@renderer/main';
import React from 'react';
import { useEffect, useState } from 'react';

export default function ToltecPage(): JSX.Element {
  const [toltecStatus, setToltecStatus] = useState("Unknown");

  const { sshKeyPath } = React.useContext(RootContext);
  const [isPluggedIn, setPluggedIn] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.invoke("ping").then((value) => { setPluggedIn(value) }).catch((error) => console.error(error));
    window.electron.ipcRenderer.invoke("checkToltecStatus", sshKeyPath).then((value) => { setToltecStatus(value) }).catch((error) => console.error(error));
  }, [])

  return (
    <div className="text-3xl bg-background h-screen w-screen grid-rows-1">
      <SideBar isOnboardingComplete={true} connected={isPluggedIn} />
      <div className="h-full flex flex-col items-center justify-center right-0 left-72 absolute gap-2">
        Toltec status: {toltecStatus}
      </div>
    </div>
  )
}

