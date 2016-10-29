'use strict';

const grpc = require('grpc');
const uuid = require('node-uuid');
const Promise = require('bluebird');

const PROTO_PATH = __dirname + '/../proto/device.proto';
const device_proto = grpc.load(PROTO_PATH).device;

function main() {
  const device = uuid.v1();
  const client = Promise.promisifyAll(
    new device_proto.TemperatureService('localhost:50051', grpc.credentials.createInsecure())
  );

  client.setTemperatureAsync({ device, celcius: 22.0 })
    .catch(e => console.error('set temperature failed', e))
    .then(() => {
      return new Promise((resolve, reject) => {
        const call = client.getTemperature({ device });
        call.on('data', console.log);
        call.on('end', resolve);
        call.on('error', reject);
      });
    })
    .then(() => console.log('end'))
    .catch(e => console.error('get temperature failed', e));
}

main();