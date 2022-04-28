import { Box } from '@mui/material';
import React from 'react';
import Header, { HEADER_HEIGHT } from './Header';
import SideBar, { SIDE_BAR_WIDTH } from './SideBar';
import { useMatch } from 'react-router-dom';

const AuthBaseLayout: React.FC = function ({ children }) {
  const patchMatch = useMatch('/auth');

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <nav>{<SideBar />}</nav>
        <Box
          style={{
            marginLeft: SIDE_BAR_WIDTH,
            marginTop: HEADER_HEIGHT,
            width: `calc(100vw-${SIDE_BAR_WIDTH})`,
            maxHeight: `calc(100vh-${HEADER_HEIGHT})`,
            scrollbarWidth: 'none',
            overflow: '-moz-hidden-unscrollable',
          }}
        >
          {children}
        </Box>
      </main>
    </>
  );
};

export default AuthBaseLayout;
