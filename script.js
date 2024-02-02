 function listenForMessages() {
    ws.addEventListener('open', (event) => {
      // Send a message to the server
      console.log("connected to server")
      ws.send(JSON.stringify({ type: 'playerJoined', player: { id:player_arr[0].id, x: player_arr[0].x, y: player_arr[0].y, rotation: player_arr[0].rotation } }));
    });
    ws.addEventListener('message', (event) => {
    // Handle messages received from the server
    const message = JSON.parse(event.data);
    console.log("Received message:", message);

    switch (message.type) {
      case 'playerJoined':
        console.log("Player joined", message.player);
        addPlayer(message.player);
        break;
      case 'playerMoved':
        console.log("Another player moved", message);
        // Example: Update player position based on received message
        updatePlayerPosition(message.playerId, message.position);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  });
  }

  function addPlayer(player) {
    // Example: Add new player to the game
    // This is where you'd modify your game state based on incoming data
    // player: { id, position } object representing the new player
    console.log(player,"KkPlayer");
    player_arr.push({ id: player.id, x: player.x, y: player.y, rotation: player.rotation });
  }

  function sendPlayerPosition(player) {
    // Example: Send player position to the server
    // This is where you'd send your game state to the server
    // position: { x, y } object representing the player's position
    ws.send(JSON.stringify({ type: 'playerMoved', player }));
  }

  function updatePlayerPosition(playerId, player) {
    // Example: Update player player in the game
    // This is where you'd modify your game state based on incoming data
    // playerId: unique identifier for the player
    // player: { x, y } object representing the player's new player
    console.log(playerId, player,"updatePlayerPosition");

    // Add new player if not already in player_arr
    var playerExists = false;
    for (var p = 0; p < player_arr.length; p++) {
      if (player_arr[p].id == playerId) {
        playerExists = true;
      }
    }
    if (!playerExists) {
      player_arr.push({ id: playerId, x: player.x, y: player.y, rotation: player.rotation });
    }

    // Update player_arr
    for (var p = 0; p < player_arr.length; p++) {
      if (player_arr[p].id == playerId) {
        player_arr[p].x = player.x;
        player_arr[p].y = player.y;
        player_arr[p].rotation = player.rotation;
      }
    }


  }