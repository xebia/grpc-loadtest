// minimal implementation only...
declare module "grpc" {
    function load(path: string): ProtoDescriptor;
    const credentials: Credentials;

    interface Credentials {
        createInsecure(): Creds;
    }

    interface Creds {}

    interface ProtoDescriptor {
        device: DeviceClient;
    }

    interface DeviceClient {
        TemperatureService: typeof TemperatureService;
    }

    class TemperatureService {
        constructor(serverAddress: string, creds?: Creds);

        setTemperature(temperature: Temperature, callback: (error: Error, result: Empty) => void): void;
        getTemperature(device: Device): Stream<Temperature>;
    }

    interface Device {
        device: string;
    }

    interface Temperature extends Device {
        celcius: number;
    }

    interface Empty {}

    class Stream<TData> {
        on(event: "data", callback: (data: TData) => void): void;
        on(event: "error", callback: (error: Error) => void): void;
        on(event: "end", callback: () => void): void;
    }
}