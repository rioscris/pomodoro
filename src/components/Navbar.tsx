import React from 'react';
import { Header, Button, Box } from 'grommet';
import { SettingsOption, Home } from 'grommet-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from '../utils/routes';

const Colors = {
  Selected: '#969a6c',
  NotSelected: '#6c6e4eff'
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isConfigPage = location.pathname === Routes.Configurations;
  const isHomePage = location.pathname === Routes.Home;

  return (
    <Header
      background="transparent"
      pad="small"
    >
      <Box direction="row" gap="medium" align="center">
        <Button
          icon={<Home size="medium" color={isHomePage ? Colors.Selected : Colors.NotSelected} />}
          onClick={() => navigate('/')}
        />
        <Button
          icon={<SettingsOption size="medium" color={isConfigPage ? Colors.Selected : Colors.NotSelected} />}
          onClick={() => navigate('/configurations')}
        />
      </Box>
    </Header>
  );
};

export default Navbar;