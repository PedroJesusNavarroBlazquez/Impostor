function ClienteWS(){
    this.socket;
	this.crearPartida=function(nick,numero){
        this.socket.emit("crearPartida",nick,numero);
    }
    this.unirAPartida=function(nick,codigo){
        this.socket.emit("unirAPartida",nick,codigo);
    }
    this.iniciarPartida=function(nick,codigo){
        this.socket.emit("iniciarPartida",nick,codigo);
    }
    this.ini=function(){
        this.socket=io.connect();
        this.lanzarSocketSrv();
    }
    //servidor WS dentro del cliente
    this.lanzarSocketSrv=function(){
        var cli=this;
        this.socket.on('connect', function(){			
        console.log("conectado al servidor de Ws");
        })
        this.socket.on('partidaCreada',function(data){
            console.log(data);
        })
        this.socket.on('unodAPartida',function(data){
            console.log(data);
        })
        this.socket.on('nuevoJugador',function(nick){
            console.log(nick+ " se una a la partida");
        })
        this.socket.on('partidaIniciada',function(fase){
            console.log("Partida en fase: "+fase);
        })

    }    
    this.ini();
}