PACKAGES_DIR            := $(HOME)/.nuget/packages
GRPC_TOOLS_DIR          := $(PACKAGES_DIR)/Grpc.Tools/1.0.1/tools
PLATFORM_GRPC_TOOLS_DIR := $(GRPC_TOOLS_DIR)/macosx_x64
PROTOC                  := $(PLATFORM_GRPC_TOOLS_DIR)/protoc
PROTOC_PLUGIN           := $(PLATFORM_GRPC_TOOLS_DIR)/grpc_csharp_plugin
PROTOC_OUT_DIR          := $(PWD)/Device
PROTOC_TARGET_FILES     := $(PROTOC_OUT_DIR)/Device.cs $(PROTOC_OUT_DIR)/DeviceGrpc.cs
CONFIG                  := Release
BIN_DIR                 := $(PWD)/bin/$(CONFIG)/netcoreapp1.0
TARGET_DLL              := $(BIN_DIR)/dotnetcore.dll

.PHONEY: all
all: $(TARGET_DLL)

.PHONEY: run
run: $(PROTOC_TARGET_FILES)
	dotnet run -c $(CONFIG)

$(TARGET_DLL): $(PROTOC_TARGET_FILES)
	dotnet build -c $(CONFIG)

$(PROTOC_TARGET_FILES): $(PROTOC) $(PROTOC_OUT_DIR)
	$(PROTOC) -I ../proto --csharp_out $(PROTOC_OUT_DIR) --grpc_out $(PROTOC_OUT_DIR) ../proto/device.proto --plugin=protoc-gen-grpc=$(PROTOC_PLUGIN)

$(PROTOC_OUT_DIR):
	mkdir -p $(PROTOC_OUT_DIR)

$(PROTOC):
	dotnet restore
