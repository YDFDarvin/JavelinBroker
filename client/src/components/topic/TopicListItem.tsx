import React, { useCallback, useMemo, useState } from 'react';
import { TopicPOJO } from '../../flows/topic';
import {
  Collapse,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Box,
  List,
  Badge,
  Divider,
  Popover,
  TextField,
  Button,
} from '@mui/material';
import { KeyboardArrowDown, ExpandLess, Delete, Send } from '@mui/icons-material';
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [message, setMessage] = useState('');

  const decodedPartitions = useMemo<PartitionPOJO[]>(
    () => topic.partitions.map((partition) => JSON.parse(atob(partition)) as unknown as PartitionPOJO),
    [topic.partitions],
  );

  const handleDeleteTopic = useCallback(
    () => socket?.emit('deleteTopic', { topic: topic.topic }).emit('findAllTopic'),
    [socket],
  );
  const handlePushTopic = useCallback(
    () =>
      socket
        ?.emit('produce', {
          topic: topic.topic,
          message: message,
        })
        .emit('findAllTopic'),
    [socket, message, topic],
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

        <Box display={'flex'} mr={'15px'} padding={'15px'}>
          <Button aria-describedby={'message-popover'} onClick={handleClick} variant={'outlined'}>
            PUSH message
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Box display={'flex'} style={{ margin: '5px 15px 0 5px' }}>
              <TextField
                id="message"
                label="Message"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="dense"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <IconButton onClick={handlePushTopic} style={{ marginLeft: '15px' }}>
                <Send color={'primary'} />
              </IconButton>
            </Box>
          </Popover>

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
