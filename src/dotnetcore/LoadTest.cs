using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Device;
using Grpc.Core;

class SimulatedDevice
{
    private static int nextId = 0;
    private const float MinTemp = -10;
    private const float MaxTemp = 45;

    private static readonly Random rnd = new Random();

    private readonly Channel channel;

    private readonly TemperatureService.TemperatureServiceClient client;

    public string ID
    {
        get;
    }

    public SimulatedDevice(string endpoint)
    {
        ID = $"device-{nextId++}";

        channel = new Channel(endpoint, ChannelCredentials.Insecure);
        client = new TemperatureService.TemperatureServiceClient(channel);
    }

    public async Task Run(uint attempts, TimeSpan timeBetweenAttempts)
    {
        var celcius = RandomTemperature();
        var cancelSource = new CancellationTokenSource();

        await SetTemperatureAsync(celcius);
        var getTemps = GetTemperatures(cancelSource.Token);

        for (var i = 1; i < attempts; i++)
        {
            await StopwatchExtension.RunAsync(
                $"{ID}: attempt {i+1}",
                async () => {
                    await Task.Delay(timeBetweenAttempts);
                    celcius = ChangeTemperature(celcius);
                    return await SetTemperatureAsync(celcius);
                }
            );
        }
        Console.WriteLine($"{ID}: done setting temperatures");
        cancelSource.Cancel();
        await getTemps;
        await channel.ShutdownAsync();
        Console.WriteLine($"{ID}: ALL DONE");
    }

    private async Task<Empty> SetTemperatureAsync(float celcius)
    {
        Console.WriteLine($"{ID}: Setting temperature to {celcius}");
        return await StopwatchExtension.RunAsync<Empty>($"{ID} setTemperature {celcius}",
            () => client.set_temperatureAsync(new Temperature {
                Device = ID,
                Celcius = celcius
            }).ResponseAsync
        );
    }

    private async Task GetTemperatures(CancellationToken token)
    {
        var sw = Stopwatch.StartNew();
        using (var call = client.get_temperature(new Device.Device { Device_ = ID }))
        using (var stream = call.ResponseStream)
        {
            // For some reason we cannot use a cancellable token here, so handle cancellation manually...
            while (await stream.MoveNext(CancellationToken.None))
            {
                Console.WriteLine($"{ID}: received temperature {stream.Current.Celcius} (gap: {sw.Elapsed}).");
                sw.Restart();
                if (token.IsCancellationRequested)
                {
                    Console.WriteLine("Cancelling GetTemperature");
                    break;
                }
            }
        }
        Console.WriteLine($"{ID} end of temeperature stream ({sw.Elapsed} since last receive)");
    }

    private float RandomTemperature()
    {
        return ((float) rnd.NextDouble() * (MaxTemp - MinTemp)) + MinTemp;
    }

    private float ChangeTemperature(float celcius) {
        var diff = (float) rnd.NextDouble();
        var sign = rnd.NextDouble() >= .5 ? 1 : -1;

        return Math.Max(MinTemp, Math.Min(MaxTemp, sign * diff));
    }
}

static class StopwatchExtension
{
    public static async Task<T> RunAsync<T>(string name, Func<Task<T>> asyncAction)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            return await asyncAction();
        }
        finally
        {
            stopwatch.Stop();
            Console.WriteLine($"{name} finished, took {stopwatch.Elapsed}.");
        }
    }
}