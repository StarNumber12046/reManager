
// eslint-disable-next-line @typescript-eslint/ban-types
function handleRetry(setPluggedIn: Function): void {
  window.electron.ipcRenderer.invoke("ping").then((value) => {setPluggedIn(value)}).catch((error) => console.error(error));
  return
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export function Disconnected({pluggedIn, setPluggedIn} : {pluggedIn: boolean, setPluggedIn: Function}): JSX.Element {
  return (
    <>
        <h1 className="text-primary w-auto font-bold text-3xl">No device found. Is it plugged in?</h1>

        <h2 className="text-primary w-auto font-thin text-2xl">Please plug in your device and try again.</h2>

        <button className="w-auto text-2xl bg-primary text-background p-2 font-normal rounded-md" onClick={() => handleRetry(setPluggedIn)}>Try again</button>
    </>

  )
}
