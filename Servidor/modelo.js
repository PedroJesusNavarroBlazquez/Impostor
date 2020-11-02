function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		//Comprobamos los limites de num
		let codigo="fallo";

		if (!this.partidas[codigo] && this.numeroValido(num)){
			codigo = this.obtenerCodigo();
			this.partidas[codigo]=new Partida(num,owner.nick,codigo);
			owner.partida=this.partidas[codigo];
		}else {
			console.log(codigo);
		}
		return codigo;
	}

	this.unirAPartida=function(codigo,nick){
		var res = -1;
		if(this.partidas[codigo]){
			res = this.partidas[codigo].agregarUsuario(nick);
		}
		return res;
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

	this.eliminarPartida = function(codigo){
		delete this.partidas[codigo];
	}
}

function Partida(num,owner, codigo){
	this.maximo = num;
	this.nickOwner = owner;
	this.codigo = codigo;
	this.fase = new Inicial();
	this.usuarios ={}//version array asociativa
	this.encargos=["tarea1", "tarea2", "tarea3","tarea4"];
	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this)
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
	this.numeroJugadores = function(){
		return Object.keys(this.usuarios).length;
	}
	this.comprobarMinimo=function(){
		return this.numeroJugadores() >= 4
	}
	this.comprobarMaximo=function(){
		return this.usuarios() < this.maximo
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

	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()) {
            this.fase = new Inicial();
        }
	}

	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}

	this.asignarEncargos = function(){
		let aleatorio=0
        for (var key in this.usuarios) {
            aleatorio=randomInt(0,this.encargos.length-1)
            this.usuarios[key].encargo=this.encargos[aleatorio]
		//Asignaremos las tareas
	}
}

	this.asignarImpostor = function(){
			let lista=Object.keys(this.usuarios);
			let aleatorio=randomInt(0,lista.length-1)
			let imp=lista[aleatorio]
			this.usuarios[imp].impostor=true;
		//Asignaremos los impostoress
}


	this.atacar=function(inocente){
		this.fase.atacar(inocente,this);
	}
	this.puedeAtacar=function(inocente){
		this.usuarios[inocente].esAtacado();
		this.comprobarFinal();
	}


	this.numeroImpostoresVivos=function(){
		let cont = 0;
		for(var key in this.usuarios){
			if(this.usuarios[key].impostor && this.usuarios[key].estado.nombre == "vivo"){
				cont++;
			}
		}
		return cont;
	}

	this.numeroCiudadanosVivos=function(){
		let cont=0;
		for(var key in this.usuarios){
			if(this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].impostor == false){
				cont++;
			}
		}
		return cont;
	}

	this.gananImpostores=function(){
		return (this.numeroImpostoresVivos()>=this.numeroCiudadanosVivos);
	}
	this.gananCiudadanos=function(){
		return (this.numeroImpostoresVivos()==0);
	}

	this.votar=function(sospechoso){
		this.usuarios[sospechoso].esVotado();
	}

	this.masVotado=function(){
		let votado=undefined;
		let max=0;
		for(var key in this.usuarios){
			if(max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}
		return votado;
	}
	this.numeroSkips=function(){
		let cont = 0;
		for(var key in this.usuarios){
			if(this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].skip==true){
				cont++;
			}
		}
		return cont;
	}

	this.comprobarVotacion=function(){
		let elegido=this.masVotado();
		//if(elegido!=undefined){
			if(elegido && elegido.votos>this.numeroSkips()){
				elegido.esAtacado();
			}
		//}


	}

	this.comprobarFinal=function(){
		if(this.gananImpostores()){
			this.finPartida();
		}
		else if(this.gananCiudadanos()){
			this.finPartida();
		}
	}
	this.finPartida=function(){
		this.fase=new Final();
	}
	this.lanzarVotacion=function(){
		this.fase.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.fase=new Votacion();
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
		partida.puedeAbandonarPartida(nick);
		//partida.eliminarUsuario(nick).
		//comprobar si no quedan usuarios.
	}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}

}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		
		partida.puedeIniciarPartida();
	}
	this.agregarUsuario=function(nick,partida){
		if(partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}
		else{
			console.log("Sorry, numero de usuario maximo");
		}
	}
	this.abandonarpartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}

	}

	this.atacar=function(inocente){};
	this.lanzarVotacion=function(){}
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
	this.atacar=function(inocente,partida){
		partida.puedeAtacar(inocente);
	}
	this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
	}

}

function Votacion(){
	this.nombre="votacion";
		this.agregarUsuario=function(nick,partida){}
		this.iniciarPartida=function(partida){}
		this.abandonarpartida=function(nick,partida){}
		this.atacar=function(inocente){};
		this.lanzarVotacion=function(){}
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
	this.atacar=function(inocente){};
	this.lanzarVotacion=function(){}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.impostor=false;
	this.encargo="ninguno";
	this.estado=new Vivo();
	this.votos=0;
	this.skip=false;
	this.haVotado=false;
	
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}

	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}	
	this.abandonarpartida=function(){
		this.partida.abandonarpartida(this.nick);
		if(this.partida.numeroJugadores()<=0){
			console.log(this.nick, "era el ultimo jugador.");
		}
	}

	this.atacar=function(inocente){
		if (this.impostor){
			this.partida.atacar(inocente);
		}
	}

	this.esAtacado=function(){
		this.estado.esAtacado(this);
	}

	this.saltarVoto=function(){
		this.skip=true;
	}

	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}

	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}

	this.votar=function(sospechoso){
		this.haVotado="true";
		this.partida.votar(sospechoso);
	}

	this.esVotado=function(){
		this.votos++;
	}
}

function Vivo(){
	this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();
	}
	this.lanzarVotacion=function(usr){
		usr.puedeLanzarVotacion();
	}
}

function Muerto(){
	this.nombre="muerto";
	this.esAtacado=function(usr){}
	this.puedeLanzarVotacion=function(usr){}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

/*function inicio(){
	juego = new Juego();
	var usr=new Usuario("pepe");
	var codigo=juego.crearPartida(4,usr);
	if(codigo!="fallo"){
		juego.unirAPartida(codigo,"pedro");
		juego.unirAPartida(codigo,"pedrito");
		juego.unirAPartida(codigo,"luis");
		usr.iniciarPartida();
	}
}*/

module.exports.Juego = Juego;
module.exports.Usuario = Usuario;