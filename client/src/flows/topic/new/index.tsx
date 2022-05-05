import React, { useCallback, useState } from 'react';
import { Box, Button, Divider, Paper, TextField, Typography } from '@mui/material';
import { useWebSockets } from '../../../context/WsContext';
import { useNavigate } from 'react-router-dom';

const CreateTopic = () => {
  const navigate = useNavigate();

  const { emit, on, socket } = useWebSockets();

  const [name, setName] = useState('');
  const [numberOfPartitions, setNumberOfPartitions] = useState(1);
  const [numberOfReplicas, setNumberOfReplicas] = useState(0);
  const [retention, setRetention] = useState(5000);

  const handleCreateTopic = useCallback(() => {
    socket?.emit('createTopic', {
      topic: name,
      params: {
        partitions: numberOfPartitions,
        replicas: numberOfReplicas,
        retention: retention / 1000,
      },
    });

    navigate('/topic');
  }, [name, numberOfPartitions, numberOfReplicas, retention]);

  return (
    <Paper style={{ padding: '15px', margin: '15px' }}>
      <Box m={'15px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant={'h5'}>Create topic</Typography>
      </Box>

      <Divider />

      <form onSubmit={handleCreateTopic}>
        <Box display={'flex'} flexDirection={'column'}>
          <TextField
            id="name"
            required
            label="Topics name"
            variant="outlined"
            margin="dense"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="partitions"
            label="Number of partitions"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="dense"
            defaultValue={1}
            value={numberOfPartitions}
            onChange={(e) => setNumberOfPartitions(Number.parseInt(e.target.value))}
          />
          <TextField
            id="partitions"
            label="Number of replicas"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="dense"
            defaultValue={0}
            value={numberOfReplicas}
            onChange={(e) => setNumberOfReplicas(Number.parseInt(e.target.value))}
          />
          <TextField
            id="partitions"
            label="Retention"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            margin="dense"
            defaultValue={5000}
            value={retention}
            onChange={(e) => setRetention(Number.parseInt(e.target.value))}
          />
        </Box>

        <Divider />

        <Box display={'flex'} justifyContent={'flex-end'} margin={'15px 0 0 0'}>
          <Button type={'submit'} variant={'outlined'}>
            Create
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreateTopic;
