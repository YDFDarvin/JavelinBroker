const { Manager } = require("socket.io-client");

const manager = new Manager("http://localhost:3000", {
    autoConnect: true
});

const socket = manager.socket("/");

manager.open((err) => {
    if (err) {
        console.log('Error occurred: ', err);
    } else {
        console.log('Connection succeeded!');
    }
});

socket.on("connect", () => {
    console.log('my connection id: ', socket.id);
});

socket.on('consume', (...args) => {
    console.log('consume handler: ', args)
})

socket.io.on('ping', (...args) => {
    socket.emit('produce', { topic: 'topicName', message: { date: new Date().toUTCString(), ctx: 'context' } });
});
