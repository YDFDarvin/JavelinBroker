import React from 'react';
import { RouteProps } from 'react-router';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import AuthBaseLayout from './AuthBaseLayout';

type AuthenticatedRouteProps = {
  unauthenticated?: boolean;
} & RouteProps;

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = function ({ unauthenticated }) {
  const navigate = useNavigate();

  if (!unauthenticated) {
    // Go to /auth to get token (kick user from route)
    return <Navigate to="/auth" />;
  }

  return (
    <AuthBaseLayout>
      {/*// TODO: add Roles verification*/}
      {unauthenticated ? (
        <Outlet />
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          height={`90%`}
          padding={'15px'}
          textAlign={'center'}
        >
          <Typography variant={'subtitle2'} fontSize={18}>
            You are not authorized to view this source
          </Typography>
          <Button
            startIcon={<Home />}
            variant={'outlined'}
            style={{ padding: '5px 30px', margin: '15px' }}
            onClick={() => navigate('/auth')}
          >
            Home
          </Button>
        </Box>
      )}
    </AuthBaseLayout>
  );
};
