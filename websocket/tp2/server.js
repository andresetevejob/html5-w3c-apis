const { SocketAddress } = require('net');

let http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    server,
    io;
server = http.createServer(function(req,res){
    fs.readFile(__dirname+'/index.html',function(err,data){
        res.writeHead(200);
        res.end(data);
    })
})
sockets=[];
server.listen(5000);
io = socketIO(server);
io.on('connection',function(socket){
    sockets.push(socket);
    socket.on('message', function (message) {
        for (var i = 0; i < sockets.length; i++) {
            sockets[i].send(message);
        }
    });
    socket.on('disconnect',function(){
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].id === socket.id) {
                sockets .splice(i, 1);
            }
        }   
        
    })
    console.log('The socket disconnected. There are ' + sockets.length + ' connected sockets');
})