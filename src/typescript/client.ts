import * as grpc from "grpc";
import * as Bluebird from "bluebird";
import * as uuid from "node-uuid";
import { join } from "path";
import { TemperatureServiceAsync } from "./grpc-async";

const PROTO_PATH = join(__dirname, "..", "..", "proto", "device.proto");
const deviceProto = grpc.load(PROTO_PATH).device;

async function main() {
    const device = uuid.v1();
    const client = Bluebird.promisifyAll(
        new deviceProto.TemperatureService("localhost:50051", grpc.credentials.createInsecure())
    ) as TemperatureServiceAsync;

    await client.setTemperatureAsync({ device, celcius: 22.0 });
    await new Bluebird((resolve, reject) => {
        const call = client.getTemperature({ device });
        call.on("data", console.log);
        call.on("end", resolve);
        call.on("error", reject);
    });
    console.log("end");
}

main().catch(console.error);