import React, { useCallback, useState } from 'react';
import { Badge, Box, Button, Collapse, Divider, IconButton, List, ListItem, Paper } from '@mui/material';
import { PartitionPOJO } from './TopicListItem';
import { ExpandLess, KeyboardArrowDown } from '@mui/icons-material';
import ReactJson from 'react-json-view';
import { useWebSockets } from '../../context/WsContext';

interface TopicPartitionsListProps {
  partition: PartitionPOJO;
  topicName: string;
}

export const TopicPartitionsList: React.FC<TopicPartitionsListProps> = ({ partition, topicName }) => {
  const { emit, on, socket } = useWebSockets();

  const [isOpen, setIsOpen] = useState(false);

  const onDeleteMessage = useCallback(
    (message: any) => () =>
      socket
        ?.emit('produce', {
          topic: topicName,
          message: message,
          isDeleteAction: true,
        })
        .emit('findAllTopic'),
    [socket],
  );

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
              {JSON.parse(atob(message)) instanceof Object ? (
                // @ts-ignore
                <ReactJson src={JSON.parse(atob(message))} />
              ) : (
                JSON.parse(atob(message))
              )}
              <Button onClick={onDeleteMessage(JSON.parse(atob(message)))}>Delete</Button>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};
