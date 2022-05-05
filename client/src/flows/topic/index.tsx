import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useWebSockets } from '../../context/WsContext';
import { TopicList } from '../components/topic';

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
  const { emit, on, socket } = useWebSockets();

  const [topics, setTopics] = useState<TopicPOJO[]>([]);

  useEffect(() => {
    socket?.emit('findAllTopic');

    socket?.on('consume', (arg0: FindAllTopicsDTO) => {
      if (arg0.result) setTopics(arg0.result);
    });

    return () => {};
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
      <TopicList topics={topics} />
    </Box>
  );
};

export default TopicPage;
