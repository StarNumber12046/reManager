import { SideBar } from '@renderer/components/SideBar'
import { RootContext } from '@renderer/main';
import React from 'react';
import { useEffect, useState } from 'react';

function InstallButton({ sshKeyPath }: { sshKeyPath: string }): React.ReactElement {
  return (<a href={sshKeyPath} className="text-sm bg-primary rounded p-2 text-white hover:bg-primary-focus">Install</a>)
}

function UninstallButton({ sshKeyPath }: { sshKeyPath: string }): React.ReactElement {
  return (<a href={sshKeyPath} className="text-sm bg-primary rounded p-2 text-white hover:bg-primary-focus">Uninstall</a>)
}

export default function ToltecPage(): JSX.Element {
  const [toltecStatus, setToltecStatus] = useState("Unknown");
  const [button, setButton] = useState(<></>);
  const { sshKeyPath } = React.useContext(RootContext);
  const [isPluggedIn, setPluggedIn] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.invoke("ping").then((value) => { setPluggedIn(value) }).catch((error) => console.error(error));
    window.electron.ipcRenderer.invoke("checkToltecStatus", sshKeyPath).then((value) => { setToltecStatus(value) }).catch((error) => console.error(error));
  }, [])

  useEffect(() => {
    if (toltecStatus === "Installed") {
      setButton(<UninstallButton sshKeyPath={sshKeyPath} />)
    }
    if (toltecStatus === "Not Installed") {
      setButton(<InstallButton sshKeyPath={sshKeyPath} />)
    }
  })

  return (
    <div className="text-3xl bg-background h-screen w-screen grid-rows-1">
      <SideBar isOnboardingComplete={true} connected={isPluggedIn} />
      <div className="h-full flex flex-col items-center justify-center right-0 left-72 absolute gap-2">
        Toltec status: {toltecStatus}
        {button}
      </div>
    </div>
  )
}

