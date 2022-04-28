import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  position: relative;
  font-weight: 400;

  &:hover {
    border-bottom: 3px solid #c62828;
    color: black;
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={`90%`}
      padding={'15px'}
      textAlign={'center'}
    >
      <Typography variant={'subtitle2'} style={{ marginRight: '15px' }} fontSize={128} color={'primary'}>
        404
      </Typography>
      <Typography variant={'subtitle2'} style={{ marginRight: '15px' }} fontSize={18}>
        The source you are looking for probably does not exists.
      </Typography>
      <Button
        startIcon={<Home />}
        variant={'outlined'}
        style={{ padding: '5px 30px', margin: '15px' }}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
    </Box>
  );
};

export default NotFound;
