function ClienteWS(){
    this.socket=undefined;
    this.nick=undefined;
    this.codigo=undefined;
    this.ini=function(){
        this.socket=io.connect();
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

    //servidor WS dentro del cliente
    this.lanzarSocketSrv=function(){
        var cli=this;
        this.socket.on('connect', function(){			
        console.log("conectado al servidor de Ws");
        });
        this.socket.on('partidaCreada',function(data){
            cli.codigo=data.codigo;
            console.log(data);
            //pruebasWS();
        })
        this.socket.on('unidoAPartida',function(data){
            cli.codigo=data.codigo;
            console.log(data);
        });
        this.socket.on('nuevoJugador',function(nick){
            console.log(nick+ " se una a la partida");
            //cli.iniciarPartida();
        })
        this.socket.on('partidaIniciada',function(fase){
            console.log("Partida en fase: "+fase);
        })
        this.socket.on('recibirListaPartidasDisponibles',function(lista){
            console.log(lista);
        })
        this.socket.on('recibirListaPartidas',function(lista){
            console.log(lista);
        })
    } 

    this.ini();
}


function pruebasWS(){
    var ws2=new ClienteWS();
    var ws3=new ClienteWS();
    var ws4=new ClienteWS();
    //var codigo=ws.codigo;

    ws2.unirAPartida("Paco",codigo);
    ws3.unirAPartida("Paquito",codigo);
    ws4.unirAPartida("Paquete",codigo);

    //ws.iniciarPartida();
}