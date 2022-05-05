import React, { useState } from 'react';
import { Badge, Box, Collapse, Divider, IconButton, List, ListItem, Paper } from '@mui/material';
import { PartitionPOJO } from './TopicListItem';
import { ExpandLess, KeyboardArrowDown } from '@mui/icons-material';
import ReactJson from 'react-json-view';

interface TopicPartitionsListProps {
  partition: PartitionPOJO;
}

export const TopicPartitionsList: React.FC<TopicPartitionsListProps> = ({ partition }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Paper variant="outlined" style={{ margin: '15px' }}>
      <Box display={'flex'}>
        <Badge badgeContent={partition.data.length} color={'primary'}>
          <IconButton disabled={!partition.data.length} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandLess /> : <KeyboardArrowDown />}
          </IconButton>
        </Badge>
        <ListItem>
          <ListItem>{partition.key}</ListItem>
          <ListItem>{partition.retention} ms</ListItem>
        </ListItem>
      </Box>

      {isOpen ? <Divider /> : null}

      <Collapse in={isOpen} unmountOnExit>
        <List style={{ padding: '15px' }}>
          Messages:
          {partition.data?.map((message) => (
            <ListItem key={message}>
              {/*// @ts-ignore*/}
              <ReactJson src={JSON.parse(atob(message))} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};
