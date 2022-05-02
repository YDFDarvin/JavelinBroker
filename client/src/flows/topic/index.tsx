import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useWebSockets } from '../../context/WsContext';

const TopicPage: React.FC = () => {
  const { emit, on } = useWebSockets();

  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    emit('findAllTopic').then((res) => {
      console.log('res: ', res);
      on('consume', (arg0) => {
        console.log('Consumed EVENT', arg0);
      }).then((response) => {
        console.log('response: ', response);
      });
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
      </Box>
    </Box>
  );
};

export default TopicPage;
