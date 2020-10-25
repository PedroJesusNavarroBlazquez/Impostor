describe("El juego del impostor", function () {
  var juego;
  var usr;

  beforeEach(function () {
    juego = new Juego();
    usr = new Usuario("Pepe", juego);
  });

  it("comprobar valores iniciales del juego", function () {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(usr.nick).toEqual("Pepe");
    expect(usr.juego).not.toBe(undefined);
  });

  it("comprobar valores de la partida", function(){
    var codigo=juego.crearPartida(3,usr);
    expect(codigo).toEqual("fallo");
    codigo=juego.crearPartida(11,usr);
    expect(codigo).toEqual("fallo");
  })

  describe("el usr Pepe crea una partida de 4 jugadores", function () {
    var codigo;
    beforeEach(function () {
      codigo = juego.crearPartida(4,usr);//usr.crearPartida(4);
    });

    it("se comprueba la partida", function () {
      expect(codigo).not.toBe(undefined);
      expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
      expect(juego.partidas[codigo].maximo).toEqual(4);
      expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
      var num = Object.keys(juego.partidas[codigo].usuarios).length;
      expect(num).toEqual(1);
    });

    it("se comprueba que no se puede crear partida, si el numero no esta dentro del limite", function(){
      var codigo = juego.crearPartida(3,usr);
      expect(codigo).toEqual("fallo");
      codigo = juego.crearPartida(11,usr);
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
      usr.iniciarPartida();
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
      usr.iniciarPartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
      usr.abandonarpartida();
      expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
    })


    /*it("Los usuarios abandonan la partida, porque se han enfadado", function () {
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
      usr.iniciarPartida();
      juego.partidas[codigo].usuarios["ana"].abandonarpartida();
      juego.partidas[codigo].usuarios["isa"].abandonarpartida();
      juego.partidas[codigo].usuarios["tomas"].abandonarpartida();
      expect(juego.partidas[codigo].numeroJugadores()).toEqual(0);
      expect(juego.partidas[codigo]).toBe(undefined);
    })*/

    //Abandonar Partida.
    //
  });
})

