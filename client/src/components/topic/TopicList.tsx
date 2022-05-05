import React from 'react';
import { Box, List } from '@mui/material';
import { TopicPOJO } from '../../flows/topic';
import { TopicListItem } from './TopicListItem';

interface TopicListProps {
  topics: TopicPOJO[];
}

export const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <Box p={'15px'}>
      <List>
        {topics?.map((topicPOJO) => (
          <TopicListItem key={topicPOJO.topic} topic={topicPOJO} />
        ))}
      </List>
    </Box>
  );
};
