import './assets/main.css'
import MainPage from './pages/page'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ToltecPage from './pages/toltec/page'
import InfoPage from './pages/info/page'

export const RootContext = React.createContext({sshKeyPath: "", setSshKeyPath: (value: string) => {value}})


function App(): React.ReactElement {
  const [sshKeyPath, setSshKeyPath] = React.useState("")
  return (
    <RootContext.Provider value={{sshKeyPath, setSshKeyPath}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}  />
        <Route path="/toltec" element={<ToltecPage />} />
        <Route path="/info" element={<InfoPage />} />
      </Routes>
    </BrowserRouter>
  </RootContext.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>
)
