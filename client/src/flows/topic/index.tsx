import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { AddCircle, Refresh } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import { useWebSockets } from '../../context/WsContext';
import { TopicList } from '../../components/topic';
import { useNavigate } from 'react-router-dom';

export interface TopicPOJO {
  topic: string;
  partitions: string[];
  params: { partitions: number; retention: number; replicas: number };
}

interface FindAllTopicsDTO {
  event: string;
  request: null | string;
  result: TopicPOJO[];
}

const TopicPage: React.FC = () => {
  const navigate = useNavigate();

  const { emit, on, socket } = useWebSockets();

  const [topics, setTopics] = useState<TopicPOJO[]>([]);

  useEffect(() => {
    findAllTopics();

    return () => {};
  }, []);

  const findAllTopics = useCallback(() => {
    socket?.emit('findAllTopic');

    socket?.on('consume', (arg0: FindAllTopicsDTO) => {
      if (arg0.result && arg0.event) {
        if (arg0.event === 'findAllTopic') setTopics(arg0.result);
      }
    });
  }, [socket]);

  return (
    <Paper style={{ padding: '15px', margin: '15px' }}>
      <Box m={'15px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant={'h5'}>All topics</Typography>

        <Box>
          <Button
            variant={'outlined'}
            startIcon={<AddCircle />}
            style={{ marginRight: '15px' }}
            onClick={() => navigate('new')}
          >
            Add
          </Button>
          <Button
            variant={'outlined'}
            startIcon={<Refresh />}
            style={{ marginRight: '15px' }}
            onClick={() => findAllTopics()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Divider />

      <TopicList topics={topics} />
    </Paper>
  );
};

export default TopicPage;
