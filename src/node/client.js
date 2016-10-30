'use strict';

const grpc = require('grpc');
const BBPromise = require('bluebird');
const uuid = require('node-uuid');
const join = require('path').join;

const PROTO_PATH = __dirname + '/../proto/device.proto';
const device_proto = grpc.load(PROTO_PATH).device;

function main() {
  const device = uuid.v1();
  const client = BBPromise.promisifyAll(
    new device_proto.TemperatureService('localhost:50051', grpc.credentials.createInsecure())
  );

  return client.setTemperatureAsync({ device, celcius: 22.0 })
    .then(() => {
      return new BBPromise((resolve, reject) => {
        const call = client.getTemperature({ device });
        call.on('data', console.log);
        call.on('end', resolve);
        call.on('error', reject);
      });
    })
    .then(() => console.log('end'))
}

main().catch(console.error);