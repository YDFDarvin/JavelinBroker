const { Manager } = require('socket.io-client');

const TOPIC_EVENTS = {
  CREATE: 'createTopic',
  GET: 'findTopic',
  GET_ALL: 'findAllTopic',
  UPDATE: 'updateTopic',
  DELETE: 'deleteTopic',
};

const manager = new Manager('http://localhost:3000', {
  autoConnect: true,
});

const socket = manager.socket('/');

manager.open((err) => {
  if (err) {
    console.log('Error occurred: ', err);
  } else {
    console.log('Connection succeeded!');
  }
});

socket.on('connect', () => {
  console.log('my connection id: ', socket.id);
});

socket.on('consume', (...args) => {
  console.log('consume handler: ', args);
});

socket.io.on('ping', (...args) => {
  socket.emit('produce', {
    topic: 'topicName',
    message: { date: new Date().toUTCString(), ctx: 'context' },
  });

  socket.emit(TOPIC_EVENTS.CREATE, {
    topic: 'topicName',
    params: { partitions: 3, replicas: 0 },
  });
  socket.emit(TOPIC_EVENTS.GET, { topic: 'topicName' });
  socket.emit(TOPIC_EVENTS.GET_ALL);
  socket.emit(TOPIC_EVENTS.UPDATE, {
    topic: 'topicName',
    params: { partitions: 3, replicas: 0 },
  });
  socket.emit(TOPIC_EVENTS.DELETE, { topic: 'topicName' });
});
