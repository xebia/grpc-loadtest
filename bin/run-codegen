#!/usr/bin/env python
from grpc.tools import protoc

protoc.main(
    (
	'',
	'-I./src/proto',
	'--python_out=./src/python',
	'--grpc_python_out=./src/python',
	'./src/proto/device.proto',
    )
)
