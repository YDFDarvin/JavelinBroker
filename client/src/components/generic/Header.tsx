import React from 'react';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';

export const HEADER_HEIGHT = '4rem';

const Header: React.FC = function () {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: HEADER_HEIGHT }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Broker Client
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
