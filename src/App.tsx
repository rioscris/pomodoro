import { Grommet } from 'grommet';
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Configurations from './components/pages/Configurations';
import CatIllustration from './components/CatIllustration';

function App() {
  return (
    <>
      <Grommet full>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/configurations" element={<Configurations />} />
          </Routes>
        <CatIllustration />
        </BrowserRouter>
      </Grommet>
    </>
  )
}

export default App
