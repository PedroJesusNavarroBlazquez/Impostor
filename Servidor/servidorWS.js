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
        //blockes .on que se refieren al mensaje. Este es el primer mensaje cuando hace la petición de conexión.
        //El socket que referencia al cliente que lo ha pedido. 
		io.on('connection',function(socket){		
            //este cliente hace el metodo de crear partida, pasandole el nick y numero de partida.     
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
                var fase=juego.partidas[codigo].fase.nombre;
                cli.enviarATodos(io,codigo,"partidaIniciada", fase);
            });

            socket.on('listarPartidasDisponibles',function(){
                var lista=juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket,"recibirListaPartidasDisponibles",lista);
            });

            socket.on('listarPartidas',function(){
                var lista=juego.listaPartidas();
                cli.enviarRemitente(socket,"recibirListaPartidas",lista);
            });
            socket.on('lanzarVotacion',function(nick,codigo){
                juego.lanzarVotacion(nick,codigo);
                var fase = juego.partidas[codigo].fase.nombre;
                cli.enviarATodos(io,codigo,"votacion",fase);
            });
            socket.on('saltarVoto',function(nick,codigo){
                var partida = juego.partidas[codigo];
                juego.saltarVoto(nick,codigo);
                if(partida.todosHanVotado()){
                    //Enviar el que es mas votado.
                    var data={"elegido":partida.elegido, "fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"finalVotacion",data)
                } else{
                    var data=partida.listaTodosQueHanVotado();
                    cli.enviarATodos(io,codigo,"haVotado",data); 
                }
            });
            socket.on('obtenerEncargo', function(nick,codigo) {
                var res=juego.obtenerEncargo(nick,codigo);
                cli.enviarRemitente(socket,"encargo",res)
            });
            socket.on("atacar",function(nick,codigo,inocente){
                var partida=juego.partidas[codigo];
                juego.atacar(nick,codigo,inocente);
                if (partida.fase.nombre="final"){
                    var data={"fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"atacado",data)
                }else{
                    var res={"nick":inocente, "estado":partida.usuarios[inocente].estado.nombre}
                    cli.enviarRemitente(socket,"muereInocente",res)
                } 
		    });
        });
    }
    
}

module.exports.ServidorWS=ServidorWS;