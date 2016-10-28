from concurrent import futures
import time
import math
import random
import grpc
import device_pb2


class TemperatureService(device_pb2.TemperatureServiceServicer):
    def set_temperature(self, request, context):
	print request
        return device_pb2.Empty()

    def get_temperature(self, request, context):
	yield device_pb2(celcius=20.0 + random.random())

class UsageService(device_pb2.UsageServiceServicer):
    def latest_electricity_usage(self, request, context):
	print request

    def latest_gas_usage(self, request, context):
	print request



def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  device_pb2.add_TemperatureServiceServicer_to_server(TemperatureService(), server)
  device_pb2.add_UsageServiceServicer_to_server(UsageService(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  print 'server running on port %s' % '50051'
  try:
    while True:
      time.sleep(24 * 2600)
  except KeyboardInterrupt:
    server.stop(0)


if __name__ == '__main__':
  serve()
