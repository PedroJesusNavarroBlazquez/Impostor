var modelo=require("./modelo.js");

function ServidorWS(){
    this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
    this.lanzarSocketSrv=function(io,juego){
        var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero) {
		        //var usr=new modelo.Usuario(nick);
                var codigo=juego.crearPartida(numero,nick);	
                socket.join(codigo);	
                console.log('usuario nick: '+nick+" crea partida codigo: "+codigo);        				
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo": codigo, "nick":nick});  		        
            });
            socket.on('unirAPartida',function(nick,codigo){
                //nick o codigo nulo
                var res=juego.unirAPartida(codigo,nick);
                socket.join(codigo);
                var owner=juego.partidas[codigo].nickOwner;
                console.log("Usuario "+nick+" se une a partida: "+codigo)
                cli.enviarRemitente(socket,"unidoAPartida",{"codigo": codigo, "owner":owner}); 
                cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
            })

            socket.on('iniciarPartida',function(nick,codigo){
                //iniciar Partida ToDo
                //controlar si nick es el owner de la partida. (En la capa de negocio no aquí).
                //cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
                juego.iniciarPartida(nick,codigo);
                var fase=juego.partida[codigo].fase.nombre;
                cli.enviarATodos(io,codigo,"partidaIniciada", fase);
            });

            socket.on('listarPartidasDisponibles',function(){
                var lista=juego.listarPartidasDisponibles();
                cli.enviarRemitente(socket,"recibirListaPartidasDisponibles",lista);
            });

            socket.on('listarPartidas',function(){
                var lista=juego.listarPartidas();
                cli.enviarRemitente(socket,"recibirListaPartidas",lista);
            });
        });
    }
    
}

module.exports.ServidorWS=ServidorWS;