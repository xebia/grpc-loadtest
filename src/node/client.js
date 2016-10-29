'use strict';

const grpc = require('grpc');
const uuid = require('node-uuid');

const PROTO_PATH = __dirname + '/../proto/device.proto';
const device_proto = grpc.load(PROTO_PATH).device;

function main() {
  const device = uuid.v1();
  const client = new device_proto.TemperatureService('localhost:50051', grpc.credentials.createInsecure())

  client.setTemperature({ device: device, celcius: 22.0 }, (err, response) => {
    if (err) {
      console.log('set temperature failed', err);
    }

    const call = client.getTemperature({ device: device });
    call.on('data', temperature => console.log(temperature));
    call.on('end', () =>  console.log('end'));
    call.on('error', console.error);
  });
}

main();