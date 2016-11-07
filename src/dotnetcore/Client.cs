using System;
using Grpc.Core;
using Device;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApplication
{
    public class Client
    {
        private static async Task Loop()
        {
            var channel = new Channel("localhost:50051", ChannelCredentials.Insecure);
            var client = new TemperatureService.TemperatureServiceClient(channel);
            var deviceId = Guid.NewGuid().ToString();

            await client.set_temperatureAsync(new Temperature { Celcius = 20.5f, Device = deviceId });

            var call = client.get_temperature(new Device.Device { Device_ = deviceId });
            while (await call.ResponseStream.MoveNext(CancellationToken.None))
            {
                var temp = call.ResponseStream.Current;
                Console.WriteLine($"Got temp: {temp.Celcius}");
            }
        }

        private static void RunSimulator(uint nofDevices)
        {
            var tasks = new Task[nofDevices];
            for (var i = 0; i < nofDevices; i++)
            {
                tasks[i] = new SimulatedDevice("localhost:50051").Run(10, TimeSpan.FromSeconds(2));
            }
            Task.WaitAll(tasks);
        }

        public static void Main(string[] args)
        {
            // Loop().Wait();
            RunSimulator(10);
        }
    }
}
