import { Box, Button } from "grommet"
import Pomodoro from "../Pomodoro";
import { SettingsOption } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';
import { useCalculatedColors } from '../../hooks/useCalculatedColors';

function Home() {
  const navigate = useNavigate();
  const colors = useCalculatedColors();

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh'
      }}
    >
      <Pomodoro />

      <Box
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <Button
          icon={<SettingsOption size="medium" color={colors.text} />}
          onClick={() => navigate('/configurations')}
          plain
          style={{
            background: 'transparent',
            border: `2px solid ${colors.border}`,
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.8s ease',
          }}
        />
      </Box>
    </Box>
  )
}

export default Home;