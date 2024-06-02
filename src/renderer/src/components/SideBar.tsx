import { type ReactNode } from 'react';
import Logo from '../assets/rM.svg';
import ToltecLogo from '../assets/toltec.svg';
import NotebookLogo from '../assets/notebook.svg';
import Info from '../assets/info.svg';
import { Link } from "react-router-dom";

function Item({ children, className, path, active }: { children?: ReactNode, className?: string, path?: string, active?: boolean }): JSX.Element {
  console.log(path)
  console.log(active)
  return <Link className={"border-t border-primary w-full px-2 flex flex-row items-center gap-2 " + (!active ? "cursor-not-allowed " : " ")  + className} to={active ? path ?? "#" : "#"}>{children}</Link>
}

export function SideBar({ connected, isOnboardingComplete }: { connected: boolean, isOnboardingComplete: boolean }): JSX.Element {
  console.log(connected, isOnboardingComplete)
  return (
    <div className="w-72 border-primary h-screen text-2xl border-r flex flex-col absolute py-2">
      <div className='grid grid-cols-3 grid-rows-2 gap-x-2 justify-center items-center pb-2'>
        <img src={Logo} className='grid-col-1 grid-row-1 row-span-2 justify-self-end' />
        <Link to="/" className='grid-col-1 grid-row-2 col-span-2 h-5'>reMarkable</Link>
        {connected ?
          <p className='grid-col-2 grid-row-1 col-span-2 flex items-center gap-1 h-5 text-lg'>
            <span className='text-green-500 text-glow-dim text-xs font-display font-mono'>⬤</span> Connected
          </p>
           :
          <p className='grid-col-2 grid-row-1 col-span-2 flex items-center gap-1 h-5 text-lg'>
            <span className='text-red-500 text-xs font-display font-mono'>⬤</span> Disconnected
          </p>}
      </div>
      <Item active={isOnboardingComplete} path='/info'><img src={Info} className='h-10' />Device Info</Item>
      <Item active={isOnboardingComplete} path='/toltec'><img src={ToltecLogo} className='h-10' />Manage Toltec</Item>
      <Item active={isOnboardingComplete} path='/notebook'><img src={NotebookLogo} className='h-10' />Manage Documents</Item>
      <Item />
    </div>
  )
}
