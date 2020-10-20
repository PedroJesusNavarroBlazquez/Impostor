function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		//Comprobamos los limites de num
		let codigo="fallo";
		if (!this.partidas[codigo] && this.numeroValido(num)){
			codigo = this.obtenerCodigo();
			this.partidas[codigo]=new Partida(num,owner.nick);
			owner.partida=this.partidas[codigo];
		}else {
			console.log(codigo);
		}
		return codigo;
	}

	this.unirAPartida=function(codigo,nick){
		if(this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}

	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXZ";
		let letras=cadena.split('');
		let maxCadena = cadena.length
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}

	this.numeroValido=function(num){
		return (num>=4 && num <=10)
	}
}

function Partida(num,owner){
	this.maximo = num;
	this.nickOwner = owner;
	this.fase = new Inicial();
	this.usuarios ={}//version array asociativa
	this.encargos=["tarea1", "tarea2", "tarea3","tarea4"];
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this)
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo = nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo] = new Usuario(nuevo);
		this.usuarios[nuevo].partida=this;
		//this.comprobarMinimo();
	}
		this.comprobarMinimo=function(){
		return Object.keys(this.usuarios).length >= 4
		}

		this.comprobarMaximo=function(){
			return Object.keys(this.usuarios).length < this.maximo
		}

		this.iniciarPartida=function(){
			this.fase.iniciarPartida(this);
		}

		this.puedeIniciarPartida=function(){
			this.fase=new Jugando();
			this.asignarEncargos();
			this.asignarImpostor();	
		}

		this.abandonarpartida=function(nick){
			this.fase.abandonarpartida(nick,this);
		}
		this.eliminarUsuario=function(nick){
			delete this.usuarios[nick];
		}

		this.asignarEncargos = function(){
			//Asignaremos las tareas
		}

		this.asignarImpostor = function(){
			//Asignaremos los impostores
		}

		this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarpartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si no quedan usuarios.
	}

}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		
		//partida.fase= new Jugando();
		partida.puedeIniciarPartida();
	}
	this.agregarUsuario=function(nick,partida){
		if(partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Sorry, numero de usuario maximo");
		}
		console.log("La partida ya ha comenzado");
	}
	this.abandonarpartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Completado();
		}
		//comprobar numero usuarios
		//partida.fase = new Inicial();
	}
}

function Jugando(){
	this.nombre="jugando";
		this.agregarUsuario=function(nick,partida){
			console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}

	this.abandonarpartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		//comprobar si termina la partida.
	}
}

function Final(){
	this.nombre="final";
		this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha terminado");
	}
	this.iniciarPartida=function(partida){
	}

	this.abandonarpartida=function(nick,partida){
		//esto es absurdo
	}
}


function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.encargo="ninguno";
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarpartida=function(){
		this.partida.abandonarpartida(this.nick);
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function inicio(){
	juego = new Juego();
	var usr=new Usuario("pepe");
	var codigo=juego.crearPartida(20,usr);
	if(codigo!="fallo"){
		juego.unirAPartida(codigo,"pedro");
		juego.unirAPartida(codigo,"pedrito");
		juego.unirAPartida(codigo,"luis");
		//juego.unirAPartida(codigo,"pepe");
	}

	usr.iniciarPartida();

}
