package main

import (
	"io"
	"log"
	"time"

	"math/rand"

	// "github.com/nu7hatch/gouuid"
	"fmt"

	"github.com/xebia/grpc-loadtest/device"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

const (
	serverAddress = "localhost:50051"
	userCount     = 10
)

func modifyTemperature(celcius float32) float32 {
	sign := rand.Intn(1)
	diff := rand.Float32()
	if sign > 0 {
		diff = -diff
	}
	return celcius + diff
}

func setTemperature(client device.TemperatureServiceClient, deviceID string, celcius *float32) {
	*celcius = modifyTemperature(*celcius)
	log.Printf("%s: Sending temperature to %f\n", deviceID, *celcius)

	_, err := client.SetTemperature(context.Background(), &device.Temperature{
		Celcius: *celcius,
		Device:  deviceID,
	})
	if err != nil {
		log.Fatalf("Did not set temperature: %v", err)
	}
}

func readTemperatures(stream device.TemperatureService_GetTemperatureClient, deviceID string, waitc chan int) {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			close(waitc)
			return
		}
		if err != nil {
			log.Fatalf("Error receiving temperatures: %v", err)
		}
		log.Printf("%s: Received temperature: %f\n", deviceID, in.Celcius)
	}
}

var clientNumber = 0

func newClientID() string {
	// id, err := uuid.NewV4()
	// if err != nil {
	// 	log.Fatalf("Error creating UUID: %v", err)
	// }
	// return id.String()
	clientNumber++
	return fmt.Sprintf("Client %d", clientNumber)
}

func runSingleClient(waitBetweenSends time.Duration, attempts int, doneChannel chan int) {
	clientID := newClientID()
	conn, err := grpc.Dial(serverAddress, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Did not connect: %v", err)
	}
	defer conn.Close()

	client := device.NewTemperatureServiceClient(conn)
	celcius := rand.Float32() * 25

	setTemperature(client, clientID, &celcius)

	stream, err := client.GetTemperature(context.Background(), &device.Device{Device: clientID})
	if err != nil {
		log.Fatalf("Did not get temperature: %v", err)
	}

	waitc := make(chan int)
	go readTemperatures(stream, clientID, waitc)

	for i := 1; i < attempts; i++ {
		time.Sleep(waitBetweenSends)

		setTemperature(client, clientID, &celcius)
	}

	close(doneChannel)
}

func main() {
	var channels [userCount]chan int

	for i := 0; i < userCount; i++ {
		channels[i] = make(chan int)
		go runSingleClient(2*time.Second, 2, channels[i])
	}

	for i := 0; i < userCount; i++ {
		<-channels[i]
	}
}
