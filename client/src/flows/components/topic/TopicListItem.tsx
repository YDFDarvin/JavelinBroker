import React, { useMemo, useState } from 'react';
import { TopicPOJO } from '../../topic';
import { Collapse, ListItem, ListItemText, Paper, IconButton, Box, List, Badge, Divider } from '@mui/material';
import { KeyboardArrowDown, ExpandLess } from '@mui/icons-material';
import { TopicPartitionsList } from './TopicPartitionsList';

interface TopicListItemProps {
  topic: TopicPOJO;
}

export interface PartitionPOJO {
  key: string;
  retention: number;
  data: string[];
}

export const TopicListItem: React.FC<TopicListItemProps> = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);

  const decocedPartitions = useMemo<PartitionPOJO[]>(
    () => topic.partitions.map((partition) => JSON.parse(atob(partition)) as unknown as PartitionPOJO),
    [topic.partitions],
  );

  return (
    <Paper variant="outlined" style={{ margin: '15px' }}>
      <Box display={'flex'}>
        <Badge badgeContent={topic.params.partitions} color={'primary'}>
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandLess /> : <KeyboardArrowDown />}</IconButton>
        </Badge>
        <ListItem>
          <ListItemText>{topic.topic}</ListItemText>
        </ListItem>
      </Box>

      {isOpen ? <Divider /> : null}

      <Collapse in={isOpen} unmountOnExit>
        <List>
          {decocedPartitions.map((decodedPartition) => (
            <TopicPartitionsList key={decodedPartition.key} partition={decodedPartition} />
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};
