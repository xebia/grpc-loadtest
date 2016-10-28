#!/usr/bin/env python
from grpc.tools import protoc

protoc.main(
    (
	'',
	'-I./proto',
	'--python_out=.',
	'--grpc_python_out=.',
	'./proto/device.proto',
    )
)
