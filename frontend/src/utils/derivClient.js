export function connectToDeriv(symbol = 'R_75') {
  const socket = new WebSocket('wss://ws.deriv.com/websockets/v3');

  socket.onopen = () => {
    socket.send(JSON.stringify({
      ticks: symbol,
      subscribe: 1
    }));
  };

  return socket;
}
