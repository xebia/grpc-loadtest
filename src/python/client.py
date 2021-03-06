from __future__ import print_function
import random
import time
import grpc
import device_pb2
import sys
import uuid


def run(uuid=str(uuid.uuid1())):
  channel = grpc.insecure_channel('localhost:50051')
  temperature_service = device_pb2.TemperatureServiceStub(channel)
  usage_service = device_pb2.UsageServiceStub(channel)

  temperature_service.set_temperature(device_pb2.Temperature(device=uuid, celcius=21.0))

  usage_service.latest_electricity_usage(device_pb2.ElectricityUsage(device=uuid, kw=120041))
  usage_service.latest_gas_usage(device_pb2.GasUsage(device=uuid, m3=520041))
  for temp in temperature_service.get_temperature(device_pb2.Device(device=uuid)):
    sys.stdout.write('%s\n' % temp)


if __name__ == '__main__':
  run()
