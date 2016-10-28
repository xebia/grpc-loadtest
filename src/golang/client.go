package main

import (
	"io"
	"log"

	"github.com/xebia/grpc-loadtest/device"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

const serverAddress = "localhost:50051"

func readTemperatures(stream device.TemperatureService_GetTemperatureClient, waitc chan int) {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			close(waitc)
			return
		}
		if err != nil {
			log.Fatalf("Error receiving temperatures: %v", err)
		}
		log.Printf("Received temperature: %f\n", in.Celcius)
	}
}

func main() {
	conn, err := grpc.Dial(serverAddress, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Did not connect: %v", err)
	}
	defer conn.Close()

	client := device.NewTemperatureServiceClient(conn)
	_, err = client.SetTemperature(context.Background(), &device.Temperature{Celcius: 20.5})
	if err != nil {
		log.Fatalf("Did not set temperature: %v", err)
	}

	stream, err := client.GetTemperature(context.Background(), &device.Empty{})
	if err != nil {
		log.Fatalf("Did not get temperature: %v", err)
	}

	waitc := make(chan int)
	go readTemperatures(stream, waitc)
	<-waitc
}
