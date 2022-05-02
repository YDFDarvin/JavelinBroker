import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Paper, Toolbar } from '@mui/material';
import { HelpOutline, ManageAccounts, Storage } from '@mui/icons-material';

enum PagesEnum {
  Main = 'main',
  Topic = 'topic',
}

interface SideBarIconProps {
  iconKey: string;
}

export const SIDE_BAR_WIDTH = '15rem';

const SideBarIcon: React.FC<SideBarIconProps> = function ({ iconKey }) {
  if (iconKey === PagesEnum.Main) return <ManageAccounts />;
  if (iconKey === PagesEnum.Topic) return <Storage />;
  return <HelpOutline />;
};

const SideBar: React.FC = function () {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: SIDE_BAR_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: SIDE_BAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Paper sx={{ overflow: 'none' }} elevation={0}>
          <List>
            {Object.values(PagesEnum)?.map((page) => (
              <ListItemButton
                key={page}
                selected={page === pathname}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/${page}`, { replace: true });
                }}
              >
                <ListItemIcon>
                  <SideBarIcon iconKey={page} />
                </ListItemIcon>
                <ListItemText primary={page} sx={{ textTransform: 'capitalize' }} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Drawer>
    </>
  );
};

export default SideBar;
