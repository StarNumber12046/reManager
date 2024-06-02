import React from 'react';
import { useState } from 'react';
import { RootContext } from '../../main';
// eslint-disable-next-line @typescript-eslint/ban-types
function handleYes(setInputDisplayed: Function): void {
  setInputDisplayed(true);

}

// eslint-disable-next-line @typescript-eslint/ban-types
function handleConnect(setInputDisplayed: Function, setSshWorks: Function, sshKeyPath: string, setOnboardingComplete: Function): void {
  setSshWorks("⏳ Working on it...")
  setInputDisplayed(false);
window.electron.ipcRenderer.invoke("checkSshWorks", sshKeyPath).then((value) => {setSshWorks(value ? "✅ Connection works" : "❌ Connection failed"); setOnboardingComplete(true)}).catch((error) => console.error(error));

}

// eslint-disable-next-line @typescript-eslint/ban-types
export function Connected({ setOnboardingComplete }: { setOnboardingComplete: Function }): JSX.Element {
  const [isInputDisplayed, setInputDisplayed] = useState(false);
  const [sshWorks, setSshWorks] = useState("");

  const {sshKeyPath, setSshKeyPath} = React.useContext(RootContext)
  return (

        <div className="text-center">

            <h1 className="text-primary w-auto font-bold mb-1">Device connected!</h1>
            <h2 className="text-primary w-auto text-2xl font-light">Do you have an SSH key set-up?</h2>
            <h3 className="text-primary w-auto text-xl font-light">(if unsure, choose no)</h3>
            <div className="flex flex-row gap-2 justify-center mt-3">
              <button className="w-auto text-2xl bg-primary text-background p-2 font-normal rounded-md" onClick={() => handleYes(setInputDisplayed)}>Yes</button>
              <button className="w-auto text-2xl bg-primary text-background p-2 font-normal rounded-md">No</button>
            </div>
            <div className="flex flex-col gap-2 justify-center mt-3">
            {isInputDisplayed ? <input required className="w-auto text-2xl bg-background text-primary border border-primary p-2 font-normal rounded-md mt-2" type="text" value={sshKeyPath} onChange={(e) => setSshKeyPath(e.target.value)} placeholder="SSH key path" /> : <></>}
            {isInputDisplayed ? <button className="w-auto text-2xl bg-primary text-background p-2 font-normal rounded-md mt-2" onClick={() => handleConnect(setInputDisplayed, setSshWorks, sshKeyPath, setOnboardingComplete)}>Connect</button> : <></>}
            </div>
            {sshWorks != "" && <h1>{sshWorks}</h1>}
        </div>

  )
}
