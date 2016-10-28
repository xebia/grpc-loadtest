from concurrent import futures
import time
import math
import random
import grpc
import device_pb2


temperature_db = {}

class TemperatureService(device_pb2.TemperatureServiceServicer):
    def set_temperature(self, request, context):
	temperature_db[request.device] = request.celcius
        return device_pb2.Empty()

    def get_temperature(self, request, context):
	while True:
		temperature = temperature_db[request.device] if request.device in temperature_db else 10.0
		yield device_pb2.Temperature(celcius=temperature + random.random())
		time.sleep(2)

class UsageService(device_pb2.UsageServiceServicer):
    def latest_electricity_usage(self, request, context):
	print request
        return device_pb2.Empty()

    def latest_gas_usage(self, request, context):
	print request
        return device_pb2.Empty()



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
