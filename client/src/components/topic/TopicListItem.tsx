import React, { useCallback, useMemo, useState } from 'react';
import { TopicPOJO } from '../../flows/topic';
import { Collapse, ListItem, ListItemText, Paper, IconButton, Box, List, Badge, Divider } from '@mui/material';
import { KeyboardArrowDown, ExpandLess, Delete } from '@mui/icons-material';
import { TopicPartitionsList } from './TopicPartitionsList';
import { useWebSockets } from '../../context/WsContext';

interface TopicListItemProps {
  topic: TopicPOJO;
}

export interface PartitionPOJO {
  key: string;
  retention: number;
  data: string[];
}

export const TopicListItem: React.FC<TopicListItemProps> = ({ topic }) => {
  const { emit, on, socket } = useWebSockets();

  const [isOpen, setIsOpen] = useState(false);

  const decodedPartitions = useMemo<PartitionPOJO[]>(
    () => topic.partitions.map((partition) => JSON.parse(atob(partition)) as unknown as PartitionPOJO),
    [topic.partitions],
  );

  const handleDeleteTopic = useCallback(
    () => socket?.emit('deleteTopic', { topic: topic.topic }).emit('findAllTopic'),
    [socket],
  );

  return (
    <Paper variant="outlined" style={{ margin: '15px' }}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box display={'flex'} alignContent={'flex-start'}>
          <Badge badgeContent={topic.params.partitions} color={'primary'}>
            <IconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ExpandLess /> : <KeyboardArrowDown />}
            </IconButton>
          </Badge>
          <ListItem>
            <ListItemText>{topic.topic}</ListItemText>
          </ListItem>
        </Box>

        <Box mr={'15px'}>
          <IconButton onClick={handleDeleteTopic}>
            <Delete color={'error'} />
          </IconButton>
        </Box>
      </Box>

      {isOpen ? <Divider /> : null}

      <Collapse in={isOpen} unmountOnExit>
        <List>
          {decodedPartitions.map((decodedPartition) => (
            <TopicPartitionsList key={decodedPartition.key} partition={decodedPartition} />
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};
