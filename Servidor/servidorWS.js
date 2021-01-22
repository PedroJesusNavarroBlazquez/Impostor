var modelo = require("./modelo.js");

function ServidorWS() {
    this.enviarRemitente = function (socket, mens, datos) {
        socket.emit(mens, datos);
    }
    this.enviarATodos = function (io, nombre, mens, datos) {
        io.sockets.in(nombre).emit(mens, datos);
    }
    this.enviarATodosMenosRemitente = function (socket, nombre, mens, datos) {
        socket.broadcast.to(nombre).emit(mens, datos)
    };
    this.lanzarSocketSrv = function (io, juego) {
        var cli = this;
        //blockes .on que se refieren al mensaje. Este es el primer mensaje cuando hace la petición de conexión.
        //El socket que referencia al cliente que lo ha pedido. 
        io.on('connection', function (socket) {
            //este cliente hace el metodo de crear partida, pasandole el nick y numero de partida.     
            socket.on('crearPartida', function (nick, numero) {
                //var usr=new modelo.Usuario(nick);
                var codigo = juego.crearPartida(numero, nick);
                socket.join(codigo);
                console.log('usuario nick: ' + nick + " crea partida codigo: " + codigo);
                cli.enviarRemitente(socket, "partidaCreada", { "codigo": codigo, "nick": nick });
            });
            socket.on('unirAPartida', function (nick, codigo) {
                //nick o codigo nulo
                var res = juego.unirAPartida(codigo, nick);
                socket.join(codigo);
                var owner = juego.partidas[codigo].nickOwner;
                console.log("Usuario " + res.nick + " se une a partida: " + res.codigo)
                cli.enviarRemitente(socket,"unidoAPartida",res);
		    	var lista=juego.obtenerListaJugadores(codigo);
		    	cli.enviarATodos(io, codigo, "nuevoJugador",lista);
            });

            socket.on('iniciarPartida', function (nick, codigo) {
                //iniciar Partida ToDo
                //controlar si nick es el owner de la partida. (En la capa de negocio no aquí).
                //cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
                juego.iniciarPartida(nick, codigo);
                var fase = juego.partidas[codigo].fase.nombre;
                cli.enviarATodos(io, codigo, "partidaIniciada", fase);
            });

            socket.on('listarPartidasDisponibles', function () {
                var lista = juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket, "recibirListaPartidasDisponibles", lista);
            });

            socket.on('listarPartidas', function () {
                var lista = juego.listaPartidas();
                cli.enviarRemitente(socket, "recibirListaPartidas", lista);
            });
            socket.on('lanzarVotacion', function (nick, codigo) {
                juego.lanzarVotacion(nick, codigo);
                var partida=juego.partidas[codigo];
                cli.enviarATodos(io, codigo, "votacion", partida.fase.nombre);
            });
            socket.on('saltarVoto', function (nick, codigo) {
                var partida = juego.partidas[codigo];
                juego.saltarVoto(nick, codigo);
                if (partida.todosHanVotado()) {
                    //Enviar el que es mas votado.
                    var data = { "elegido": partida.elegido, "fase": partida.fase.nombre }
                    cli.enviarATodos(io, codigo, "finalVotacion", data)
                } else {
                    var data = partida.listaTodosQueHanVotado();
                    cli.enviarATodos(io, codigo, "haVotado", data);
                }
            });
            socket.on("votar", function (nick, codigo, sospechoso) {
                var partida = juego.partidas[codigo];
                juego.votar(nick, codigo, sospechoso);
                if (partida.todosHanVotado()) {
                    var data = { "elegido": partida.elegido, "fase": partida.fase.nombre };
                    cli.enviarATodos(io, codigo, "finalVotacion", data);
                }
                else {
                    cli.enviarATodos(io, codigo, "haVotado", partida.listaHanVotado());
                }
            });

            socket.on('obtenerEncargo', function (nick, codigo) {
                var encargo=juego.partidas[codigo].usuarios[nick].encargo;
		    	var impostor=juego.partidas[codigo].usuarios[nick].impostor;
		    	cli.enviarRemitente(socket,"encargo",{"encargo":encargo,"impostor":impostor});
            });

            socket.on("atacar", function (nick, codigo, inocente) {
                juego.atacar(nick, codigo, inocente);
                var partida = juego.partidas[codigo];
                var fase = partida.fase.nombre;
                //cli.enviarRemitente(socket, "hasAtacado", fase);
                if (fase == "final") {
                    cli.enviarATodos(io, codigo, "final", "ganan impostores");
                } else {
                    cli.enviarATodos(io, codigo, "muereInocente", inocente);
                }
            });
        });
    }

}

module.exports.ServidorWS = ServidorWS;