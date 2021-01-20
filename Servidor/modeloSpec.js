var modelo = require("./modelo.js");

describe("El juego del impostor", function () {
  var juego;
  //var usr;
  var nick;

  beforeEach(function () {
    juego = new modelo.Juego();
    nick = "Pepe";
    //usr = new modelo.Usuario("Pepe", juego);
  });

  it("comprobar valores iniciales del juego", function () {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(nick).toEqual("Pepe");
    //expect(nick.juego).not.toBe(undefined);
  });

  it("comprobar valores de la partida", function () {
    var codigo = juego.crearPartida(3, nick);
    expect(codigo).toEqual("fallo");
    codigo = juego.crearPartida(11, nick);
    expect(codigo).toEqual("fallo");
  })

  describe("el usr Pepe crea una partida de 4 jugadores", function () {
    var codigo;
    beforeEach(function () {
      codigo = juego.crearPartida(4, nick);//usr.crearPartida(4);
    });

    /*it("se comprueba la partida", function () {
      expect(codigo).not.toBe(undefined);
      expect(juego.partidas[codigo].nickOwner).toEqual(nick);
      expect(juego.partidas[codigo].maximo).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(1);
    });

    it("se comprueba que no se puede crear partida, si el numero no esta dentro del limite", function () {
      var codigo = juego.crearPartida(3, nick);
      expect(codigo).toEqual("fallo");
      codigo = juego.crearPartida(11, nick);
      expect(codigo).toEqual("fallo");
    })

    it("varios usuarios se unen a la partida", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
    });

    it("Pepe inicia la partida", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
    })

    it("Pepe abandona la partida", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      juego.partidas[codigo].usuarios[nick].abandonarpartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
    })


    it("Los usuarios abandonan la partida, porque se han enfadado", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      juego.partidas[codigo].usuarios["ana"].abandonarpartida();
      juego.partidas[codigo].usuarios["isa"].abandonarpartida();
      juego.partidas[codigo].usuarios["tomas"].abandonarpartida();
      juego.partidas[codigo].usuarios["Pepe"].abandonarpartida();
      expect(juego.partidas[codigo].numeroJugadores()).toEqual(0);
    })

    it("Tareas asignadas a los usuarios", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      for (var key in juego.partidas[codigo].usuarios) {
        expect(juego.partidas[codigo].usuarios[key].encargo).not.toBe("ninguno");
      }
    })

    it("Impostor ha sido asignado", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");

      for (var i in juego.partidas[codigo].usuarios) {
        if (juego.partidas[codigo].usuarios[i].impostor == true) {
          Impostor = true;
        }
      }
      expect(Impostor).toEqual(true);
    })


    it("Impostor ataca y mata a un ciudadano", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");

      var muertos = 0;
      for (var i in juego.partidas[codigo].usuarios) {
        if (juego.partidas[codigo].usuarios[i].impostor == true) {
          var impostor = i;
        }
        else {
          var ciudadano = i;
        }
      }
      juego.partidas[codigo].usuarios[impostor].atacar[ciudadano];
      for (var j in juego.partidas[codigo].usuarios) {
        if (juego.partidas[codigo].usuarios[j].estado.nombre = "muerto") {
          muertos++;
        }
      }

      expect(muertos) > 0;
    })

    /*it("Impostor ataca y mata a un ciudadano", function () {
       juego.unirAPartida(codigo, "ana");
       var num = Object.keys(juego.partidas[codigo].usuarios).length;
       expect(num).toEqual(2);
       expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
       juego.unirAPartida(codigo, "isa");
       var num = Object.keys(juego.partidas[codigo].usuarios).length;
       expect(num).toEqual(3);
       expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
       juego.unirAPartida(codigo, "tomas");
       var num = Object.keys(juego.partidas[codigo].usuarios).length;
       expect(num).toEqual(4);
       expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
       juego.iniciarPartida(nick,codigo);
       expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
 
       for(var i in juego.partidas[codigo].usuarios){
         if (juego.partidas[codigo].usuarios[i].impostor==true){
           var impostor = i;
         };
       }
 
       for(var i in juego.partidas[codigo].usuarios){
         if (juego.partidas[codigo].usuarios[i].impostor==false){
         juego.partidas[codigo].usuarios[impostor].atacar[i];
         }; 
       }
 
       var ganaImpostor=juego.partidas[codigo].gananImpostores();
       expect(ganaImpostor).toEqual(true)
     })*/



   /* it("Los participantes votan skip y no muere nadie", function () {
      juego.unirAPartida(codigo, "ana");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(2);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "isa");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(3);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      juego.unirAPartida(codigo, "tomas");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
      juego.iniciarPartida(nick, codigo);
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");

      for (var i in juego.partidas[codigo].usuarios) {
        juego.partidas[codigo].usuarios[i].saltarVoto();
        expect(juego.partidas[codigo].usuarios[i].skip).toEqual(true);
      }

      juego.partidas[codigo].comprobarVotacion()

      for (var i in juego.partidas[codigo].usuarios) {
        expect(juego.partidas[codigo].usuarios[i].estado.nombre).toEqual("vivo")
      }
    })

    /*
          it("Los ciudadanos votan al impostor y ganan", function () {
            juego.unirAPartida(codigo, "ana");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(2);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "isa");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(3);
            expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
            juego.unirAPartida(codigo, "tomas");
            var num = Object.keys(juego.partidas[codigo].usuarios).length;
            expect(num).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
            juego.iniciarPartida(nick,codigo);
            expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      
            for(var i in juego.partidas[codigo].usuarios){
              if (juego.partidas[codigo].usuarios[i].impostor==true){
                var impostor = i;
              };
            }
    
            for(var i in juego.partidas[codigo].usuarios){
              if(juego.partidas[codigo].usuarios[i].impostor==false){
                juego.partidas[codigo].usuarios[i].votar(impostor);
              }
            }
      
            juego.partidas[codigo].comprobarVotacion()
            var ganador = juego.partidas[codigo].gananCiudadanos();
              expect(ganador).toBe(true)
            })
            */
  });
})

