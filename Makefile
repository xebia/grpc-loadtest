.PHONY: all
all: src/python/device_pb2.py src/golang/device/device.pb.go

src/python/device_pb2.py: src/proto/device.proto
	. grpc/bin/activate && bin/run-codegen

src/golang/device/device.pb.go: src/proto/device.proto
	bin/golang-codegen

.PHONY:	install
install:
	virtualenv grpc
	. grpc/bin/activate && python -m pip install --upgrade pip
	. grpc/bin/activate && pip install -r src/python/requirements.txt
	test $$(uname) == "Darwin" && brew install protobuf || echo ok
	go get google.golang.org/grpc
	go get -u github.com/golang/protobuf/{proto,protoc-gen-go}