import * as BBPromise from "bluebird";
// import { v1 as newUuid } from "node-uuid";
import { DeviceClient } from "./DeviceClient";
import * as stopwatch from "./Stopwatch";

class Device {
    private static nextID = 0;
    private readonly id = `device-${Device.nextID++}`; // newUuid();
    private readonly client: DeviceClient;

    private static readonly MinTemp = -10;
    private static readonly MaxTemp = 45;

    constructor(serverAddress: string) {
        this.client = new DeviceClient(serverAddress);
    }

    async run(attempts: number, secondsBetweenAttemps: number) {
        const tempSvc = this.client.temperatureService;
        let celcius = this.randomTemperature();

        await this.setTemperature(celcius);

        const tempStream = tempSvc.getTemperature({device: this.id});
        const dataStopwatch = stopwatch.startStopwatch(`${this.id}: getTemperature`);
        tempStream.on("data", c => console.log(`${c.device}: Received temp: ${c.celcius} after ${dataStopwatch.lap(false) / 1000} s`));
        tempStream.on("end", () => dataStopwatch.stop());
        tempStream.on("error", err => {
            dataStopwatch.stop(" (failed)");
            console.error(`${this.id}: error:`, err);
        });

        for (let i = 1; i < attempts; i++) {
            await stopwatch.runAsync(`${this.id} attempt ${i+1}`, async () => {
                await BBPromise.delay(secondsBetweenAttemps * 1000);
                celcius = this.changeTemperature(celcius);
                await this.setTemperature(celcius);
            });
        }
        console.log(`${this.id}: ALL DONE`);
    }

    private setTemperature(celcius: number) {
        console.log(`${this.id}: Setting temperature to ${celcius}`);
        return stopwatch.runAsync(
            `${this.id}: setTemperature`,
            () => this.client.temperatureService.setTemperatureAsync({device: this.id, celcius})
        );
    }

    private randomTemperature() {
        return (Math.random() * (Device.MaxTemp - Device.MinTemp)) + Device.MinTemp;
    }

    private changeTemperature(celcius: number) {
        const diff = Math.random();
        const sign = Math.round(Math.random());

        return sign > 0 ? Math.min(celcius + diff, Device.MaxTemp) : Math.max(celcius - diff, Device.MinTemp);
    }
}

function main() {
    const nofDevices = 9;
    const waitSecondsBetweenUpdates = 1;
    const updatesPerDevice = 10;

    const devices: Device[] = new Array(nofDevices);

    for (let i = 0; i < nofDevices; i++) {
        devices[i] = new Device("localhost:50051");
    }
    BBPromise.all(devices.map(d => d.run(updatesPerDevice, waitSecondsBetweenUpdates)));
}

main();
