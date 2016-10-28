import time
from locust import Locust, events, task, TaskSet
import grpc
import device_pb2

REQUEST_TYPE = "gRPC"

class ThermostatClient(object):
    def __init__(self, channel):
        self._stub = device_pb2.TemperatureServiceStub(channel)

    def set_temperature(self, celcius):
        start_time = time.time()
        try:
            self._stub.set_temperature(device_pb2.Temperature(celcius=celcius))
        except Exception as e:
            total_time = int((time.time() - start_time) * 1000)
            events.request_failure.fire(request_type=REQUEST_TYPE, name="set_temperature", response_time=total_time, exception=e)
            raise
        else:
            total_time = int((time.time() - start_time) * 1000)
            events.request_success.fire(request_type=REQUEST_TYPE, name="set_temperature", response_time=total_time, response_length=0)

    def get_temperature(self):
        for temp in self._stub.get_temperature(device_pb2.Empty()):
            print 'Got temp: {0}'.format(temp)

if __name__ == "__main__":
    client = ThermostatClient(grpc.insecure_channel('localhost:50051'))
    client.set_temperature(21.5)
    client.get_temperature()
    print 'Done'