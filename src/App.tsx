import { Grommet } from 'grommet';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Configurations from './components/pages/Configurations';
import { ColorModeProvider } from './contexts/ColorModeContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import Pomodoro from './components/Pomodoro';

function App() {
  return (
    <>
      <BrowserRouter>
        <ColorModeProvider>
          <PomodoroProvider>
            <Grommet full>
              <Routes>
                <Route path="/" element={<Pomodoro />} />
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
