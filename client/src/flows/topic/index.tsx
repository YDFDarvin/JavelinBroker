import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useWebSockets } from '../../context/WsContext';

const TopicPage: React.FC = () => {
  const { emit, on, socket } = useWebSockets();

  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    socket?.emit('findAllTopic').on('consume', (arg0) => {
      console.log('Consumed EVENT', arg0);
      if (arg0.result) {
        setTopics(arg0.result);
      }
    });
  }, []);

  return (
    <Box p={'15px'}>
      <Box>
        <Button
          variant={'outlined'}
          style={{ marginRight: '15px' }}
          onClick={() =>
            emit('createTopic', {
              topic: 'users',
              params: { partitions: 2, retention: 10, replicas: 0 },
            })
          }
        >
          Add new topic
        </Button>
        <Button variant={'outlined'} style={{ marginRight: '15px' }} onClick={() => emit('findAllTopic')}>
          Refresh
        </Button>
      </Box>
      {JSON.stringify(topics)}
    </Box>
  );
};

export default TopicPage;
