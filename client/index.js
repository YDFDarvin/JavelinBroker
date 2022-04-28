const { Manager } = require('socket.io-client');
const crypto = require('crypto');

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
  socket.emit(TOPIC_EVENTS.CREATE, {
    topic: 'messages',
    params: { partitions: 3, retention: 5, replicas: 0 },
  });
  /*  socket.emit(TOPIC_EVENTS.CREATE, {
    topic: 'users',
    params: { partitions: 2, retention: 10, replicas: 0 },
  });*/
  socket.emit(TOPIC_EVENTS.GET_ALL);
});

socket.on('consume', (args) => {
  console.log('\n\nConsumed EVENT: ', args.event);
  // console.log('Consumed Request: ', args.request);
  // console.log('Consumed Result: ', args.result);

  if (Array.isArray(args.result)) {
    const topic = args.result?.find((topic) => topic.topic === 'messages');
    const partitions = topic.partitions?.map((partition) =>
      JSON.parse(Buffer.from(partition, 'base64').toString('utf8')),
    );
    console.log('Partitions: ', partitions);
  }
});

socket.on('exception', (...args) => {
  console.log('exception: ', ...args);
});

socket.io.on('ping', (...args) => {
  console.log('PING');

  socket.emit('produce', {
    topic: 'messages',
    message: crypto.randomBytes(20).toString('hex'),
  });
  socket.emit(TOPIC_EVENTS.GET_ALL);
});
