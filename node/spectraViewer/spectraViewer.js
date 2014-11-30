var socket = io.connect();

socket.on('dataset', function(data) {
  console.log(data['dataset']);
});
