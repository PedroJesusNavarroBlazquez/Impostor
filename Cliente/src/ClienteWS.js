function ClienteWS(){
    this.socket=undefined;
    this.nick=undefined;
    this.codigo=undefined;
    this.owner=false;
    this.estado;
    this.encargo;

    //Socket.IO is a library that enables real-time, bidirectional and event-based communication 
    //between the browser and the server.
    //
    this.ini=function(){
        this.socket=io.connect();
        //El metodo lanzarSocketSrv sirve para que el cliente pueda escuchar a posibles llamadas del servidor. 
        this.lanzarSocketSrv();
    }
	this.crearPartida=function(nick,numero){
        this.nick=nick;
        this.socket.emit("crearPartida",nick,numero);
    }
    this.unirAPartida=function(nick,codigo){
        this.nick=nick;
        this.socket.emit("unirAPartida",nick,codigo);
    }
    this.iniciarPartida=function(){
        this.socket.emit("iniciarPartida",this.nick, this.codigo);
    }
    this.listarPartidasDisponibles=function(){
        this.socket.emit("listarPartidasDisponibles");
    }
    this.listarPartidas=function(){
        this.socket.emit("listarPartidas");
    }
    this.lanzarVotacion=function(){
        this.socket.emit("lanzarVotacion", this.nick, this.codigo);
    }
    this.saltarVoto=function(){
        this.socket.emit("saltarVoto", this.nick, this.codigo);
    }
    this.votar=function(sospechoso){
        this.socket.emit("votar", this.nick, this.codigo,sospechoso);
    }
    this.obtenerEncargo=function(){
        this.socket.emit("obtenerEncargo", this.nick, this.codigo,)
    }
    this.atacar=function(inocente){
        this.socket.emit("atacar",this.nick,this.codigo,inocente);
    }


    //servidor WS dentro del cliente
    //Código del servidor web socket dentro del cliente. 
    this.lanzarSocketSrv=function(){
        //Creamos una variable para guardar el objeto this, ya que al hacer los callbacks se puede liar un pisto.
        var cli=this;
        this.socket.on('connect', function(){			
        console.log("conectado al servidor de Ws");
        });
        this.socket.on('partidaCreada',function(data){
            cli.codigo=data.codigo;
            console.log(data);
            if(data.codigo!="fallo"){
                cw.mostrarEsperandoRival();
            }
        })
        this.socket.on('unidoAPartida',function(data){
            cli.codigo=data.codigo;
            console.log(data);
            cw.mostrarEsperandoRival();

        });
        this.socket.on('nuevoJugador',function(nick){
            console.log(nick+ " se une a la partida");
            //cli.iniciarPartida();
        })
        this.socket.on('partidaIniciada',function(fase){
            console.log("Partida en fase: "+fase);
        })
        this.socket.on('recibirListaPartidasDisponibles',function(lista){
            console.log(lista);
            cw.mostrarUnirAPartida(lista);
        })
        this.socket.on('recibirListaPartidas',function(lista){
            console.log(lista);
        })
        this.socket.on('votacion', function(data){
            console.log(data);
        });
        this.socket.on('finalVotacion',function(data){
            console.log(data);
        })
        this.socket.on('haVotado',function(data){
            console.log(data);
        })
        this.socket.on('encargo', function(data){
            console.log(data);
        });
        this.socket.on("atacado",function(data){
			console.log(data);
		});
        this.socket.on('muereInocente',function(data){
            console.log(data);
        })
    } 

    this.ini();
}

var ws2, ws3, ws4;
function pruebasWS(){
    ws2=new ClienteWS();
    ws3=new ClienteWS();
    ws4=new ClienteWS();
    var codigo=ws.codigo;

    ws2.unirAPartida("Paco",codigo);
    ws3.unirAPartida("Paquito",codigo);
    ws4.unirAPartida("Paquete",codigo);
    //ws.iniciarPartida();
    //ws.lanzarVotacion();
}

function votaciones(){
    ws.votar("Paco");
    ws2.votar("Paco");
    ws3.votar("Paco");
    ws4.votar("Paco");
}

function saltarVotos(){
    ws.saltarVoto();
    ws2.saltarVoto();
    ws3.saltarVoto();
    ws4.saltarVoto();
}

function encargos(){
	ws.obtenerEncargo();
	ws2.obtenerEncargo();
	ws3.obtenerEncargo();
	ws4.obtenerEncargo();
}

