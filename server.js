var express = require('express');
var SignalRJS = require('signalrjs');
 
//Init SignalRJs 
var signalR = SignalRJS();
 
//Create the hub connection 
//NOTE: Server methods are defined as an object on the second argument 
signalR.hub('chatHub',{
    send : function(message){
        this.clients.all.invoke('broadcast').withArgs([message])
        console.log('send:'+message);
    }
});
 
var server = express();
server.use(express.static(__dirname));
server.set('views',__dirname + '/pages');
server.set('view engine', 'ejs');
server.engine('html', require('ejs').renderFile);

server.use(signalR.createListener())
server.set('port', (process.env.PORT || 3000));
server.get('/', function(request, response) {
  response.render('client.html');
});
server.listen(server.get('port'), function() {
  console.log('Node app is running on port', server.get('port'));
});