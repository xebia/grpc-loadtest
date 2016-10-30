import * as grpc from "grpc";
import * as Bluebird from "bluebird";

export interface TemperatureServiceAsync extends grpc.TemperatureService {
    setTemperatureAsync(temperature: grpc.Temperature): Bluebird<grpc.Empty>;
}
