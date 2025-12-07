import { Grommet } from 'grommet';
import './App.css'
import Home from './components/pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Configurations from './components/pages/Configurations';
import { ColorModeProvider } from './contexts/ColorModeContext';
import { PomodoroProvider } from './contexts/PomodoroContext';

function App() {
  return (
    <>
      <BrowserRouter>
        <ColorModeProvider>
          <PomodoroProvider>
            <Grommet full>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/configurations" element={<Configurations />} />
              </Routes>
            </Grommet>
          </PomodoroProvider>
        </ColorModeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
