package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Allow all origins
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Type   string `json:"type"`
	Player struct {
		ID       int     `json:"id"`
		X        float64 `json:"x"`
		Y        float64 `json:"y"`
		Rotation float64 `json:"rotation"`
	} `json:"player"`
}

var clients = make(map[*websocket.Conn]bool)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	clients[ws] = true

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}
		broadcastMessage(msg, ws)
	}
}

func broadcastMessage(msg Message, sender *websocket.Conn) {
	for client := range clients {
		if client != sender {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	http.HandleFunc("/", handleConnections)

	go func() {
		log.Println("Starting server on :8080")
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}()

	// Keep the main goroutine alive
	select {}
}
