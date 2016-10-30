import * as grpc from "grpc";
import * as BBPromise from "bluebird";

export interface TemperatureServiceAsync extends grpc.TemperatureService {
    setTemperatureAsync(temperature: grpc.Temperature): BBPromise<grpc.Empty>;
}
