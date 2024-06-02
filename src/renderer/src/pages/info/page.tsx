import { SideBar } from '@renderer/components/SideBar'
import { RootContext } from '@renderer/main';
import React from 'react';
import { useEffect, useState } from 'react';

export default function InfoPage(): JSX.Element {
  const [toltecStatus, setToltecStatus] = useState("Unknown");
  const [osVersion, setOsVersion] = useState("Unknown");
  const [model, setModel] = useState("Unknown");

  const { sshKeyPath } = React.useContext(RootContext);
  const [isPluggedIn, setPluggedIn] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.invoke("ping").then((value) => { setPluggedIn(value) }).catch((error) => console.error(error));
    window.electron.ipcRenderer.invoke("checkToltecStatus", sshKeyPath).then((value) => { setToltecStatus(value) }).catch((error) => console.error(error));
    window.electron.ipcRenderer.invoke("getOsVersion", sshKeyPath).then((value) => { setOsVersion(value) }).catch((error) => console.error(error));
    window.electron.ipcRenderer.invoke("getExactModel", sshKeyPath).then((value) => { setModel(value) }).catch((error) => console.error(error));
  }, [])

  return (
    <div className="text-3xl bg-background h-screen w-screen grid-rows-1">
      <SideBar isOnboardingComplete={true} connected={isPluggedIn} />
      <div className="h-full flex flex-col items-center justify-center right-0 left-72 absolute gap-2">
        <p>Model: {model}</p>
        <p>Toltec status: {toltecStatus}</p>
        <p>OS Version: {osVersion}</p>
      </div>
    </div>
  )
}

