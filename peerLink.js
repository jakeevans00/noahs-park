const { WebSocketServer } = require("ws");
const uuid = require("uuid");

function peerLink(httpServer) {
    // Create a websocket object
    const wss = new WebSocketServer({ noServer: true });

    // Handle the protocol upgrade from HTTP to WebSocket
    httpServer.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
        });
    });

    // Keep track of all the connections so we can forward messages
    let connections = [];
}