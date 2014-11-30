var socket = io('http://astrowebservices.com:8001');

socket.on('dataset', function(data) {
  console.log(data['dataset']);
});
