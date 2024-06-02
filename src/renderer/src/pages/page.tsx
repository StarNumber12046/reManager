import { SideBar } from '@renderer/components/SideBar'
import { useEffect, useState } from 'react';
import { Waiting } from './components/Waiting';
import { Connected } from './components/Connected';
import { Disconnected } from './components/Disconnected';

export default function MainPage(): JSX.Element {
  const [component, setComponent] = useState(<Waiting />);
  const [isPluggedIn, setPluggedIn] = useState(false);
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.invoke("ping").then((value) => {setPluggedIn(value)}).catch((error) => console.error(error));
  }, [])
  useEffect(() => {
    setComponent(isPluggedIn ? <Connected setOnboardingComplete={setOnboardingComplete} /> : <Disconnected pluggedIn={isPluggedIn} setPluggedIn={setPluggedIn} />)
  }, [isPluggedIn])
  return (
    <div className="text-3xl bg-background h-screen w-screen grid-rows-1">
      <SideBar connected={isPluggedIn} isOnboardingComplete={isOnboardingComplete} />
      <div className="h-full flex flex-col items-center justify-center right-0 left-72 absolute gap-2">
        {component}
      </div>
    </div>
  )
}

