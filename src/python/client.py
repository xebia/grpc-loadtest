from __future__ import print_function
import random
import time
import grpc
import device_pb2


def run():
  channel = grpc.insecure_channel('localhost:50051')
  #temperature_service = device_pb2.TemperatureServiceStub(channel)
  usage_service = device_pb2.UsageServiceStub(channel)
  usage_service.latest_electricity_usage(device_pb2.ElectricityUsage(kw=120041))
  usage_service.latest_gas_usage(device_pb2.GasUsage(m3=520041))
  guide_route_chat(route_guide_stub)


if __name__ == '__main__':
  run()
