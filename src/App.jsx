import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import CustomUI from './CustomUI'

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* 
        hideUi removes the default tldraw UI 
        so we can build our own exactly like the picture.
      */}
      <Tldraw hideUi>
        <CustomUI />
      </Tldraw>
    </div>
  )
}

export default App
