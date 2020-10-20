describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
	  juego = new Juego();
	  usr = new Usuario("Pepe",juego);
  });
  
  it("inicialmente...", function() {
	 expect(Object.keys(juego.partidas).length).toEqual(0);
	 expect(usr.nick).toEqual("Pepe");
   expect(usr.juego).not.toBe(undefined);
  });
  
  it("El usr Pepe crea una partida de 4 jugadores",function(){
  var codigo=usr.crearPartida(4);
  expect(codigo).not.toBe(undefined);
  expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
  expect(juego.partidas[codigo].fase).toEqual(Inicial);
});
  
});

