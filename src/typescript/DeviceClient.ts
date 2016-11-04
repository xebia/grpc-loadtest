import * as grpc from "grpc";
import { promisifyAll } from "bluebird";
import { join as joinPath } from "path";
import { TemperatureServiceAsync } from "./grpc-async";

export class DeviceClient {
    private static readonly ProtoPath = joinPath(__dirname, "..", "..", "proto", "device.proto");

    private readonly _temperatureService: TemperatureServiceAsync;

    constructor(serverAddress: string) {
        const client = grpc.load(DeviceClient.ProtoPath).device;

        this._temperatureService = promisifyAll(
            new client.TemperatureService(serverAddress, grpc.credentials.createInsecure())
        ) as TemperatureServiceAsync;
    }

    get temperatureService(): TemperatureServiceAsync {
        return this._temperatureService;
    }
}