var PROTO_PATH = __dirname + '/../proto/device.proto';

var grpc = require('grpc');

var device_proto = grpc.load(PROTO_PATH).device;

function main() {
  var client = new device_proto.TemperatureService('localhost:50051',
                                       grpc.credentials.createInsecure())

  client.setTemperature({celcius: 22.0 }, function(err, response) {
    if(err) {
       console.log('set temperature failed', err);
    }
  });

  call = client.getTemperature({});
  call.on('data', function(temperature) {
	console.log(temperature);
  });
  call.on('end', function() { console.log('end'); });
}

main();
