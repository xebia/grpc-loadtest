.PHONY:	install


all: src/python/device_pb2.py

src/python/device_pb2.py: src/proto/device.proto
	bin/run-codegen

install:
	virtualenv grpc
	. grpc/bin/activate && python -m pip install --upgrade pip
	. grpc/bin/activate && pip install -r requirements.txt
