const { Manager } = require('socket.io-client');

const TOPIC_EVENTS = {
  CREATE: 'createTopic',
  GET: 'findTopic',
  GET_ALL: 'findAllTopic',
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
  console.log('consume: ', ...args);
});

socket.on('exception', (...args) => {
  console.log('exception: ', ...args);
});

socket.on(TOPIC_EVENTS.GET, (...args) => {
  console.log(TOPIC_EVENTS.GET, ...args);
});
socket.on(TOPIC_EVENTS.GET_ALL, (...args) => {
  console.log(TOPIC_EVENTS.GET_ALL, ...args);
});

socket.io.on('ping', (...args) => {
  /*  socket.emit('produce', {
    topic: 'topicName',
    message: { date: new Date().toUTCString(), ctx: 'context' },
  });*/
  //emitTopicsCrud();
  console.log('PING');
  socket.emit(TOPIC_EVENTS.CREATE, {
    topic: 'topic1',
    params: { partitions: 3, retention: 5, replicas: 0 },
  });
  socket.emit(TOPIC_EVENTS.CREATE, {
    topic: 'topic2',
    params: { partitions: 2, retention: 10, replicas: 0 },
  });
});
