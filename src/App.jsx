import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import TabManager from './TabManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <TabManager/>

    </>
  )
}

export default App
