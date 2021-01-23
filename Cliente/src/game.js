/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

function lanzarJuego() {
  game = new Phaser.Game(config);
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game;// = new Phaser.Game(config);
let cursors;
let player;
let player2;
let jugadores = [];
let showDebug = false;
let camera;
let worldLayer;
let map;
let crear;
let recursos = [{ id: 0, nombre: "ana" }, { id: 3, nombre: "pepe" }, { id: 6, nombre: "tom" }, { id: 8, nombre: "rayo" }];

function preload() {
  this.load.image("tiles", "cliente/assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "cliente/assets/tilemaps/tuxemon-town.json");

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // If you don't use an atlas, you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  //this.load.atlas("atlas", "cliente/assets/atlas/atlas.png", "cliente/assets/atlas/atlas.json");
  //this.load.spritesheet("gabe","cliente/assets/images/gabe.png",{frameWidth:24,frameHeight:24});
  //this.load.spritesheet("gabe","cliente/assets/images/male01-2.png",{frameWidth:32,frameHeight:32});
  this.load.spritesheet("varios", "cliente/assets/images/pedro.png", { frameWidth: 32, frameHeight: 48 });
}

function create() {
  crear = this;
  map = crear.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  // player = this.physics.add
  //   .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
  //   .setSize(30, 40)
  //   .setOffset(0, 24);

  // // Watch the player and worldLayer for collisions, for the duration of the scene:
  //this.physics.add.collider(player, worldLayer);

  const anims = crear.anims;
  anims.create({
    key: "pedro-left-walk",
    frames: anims.generateFrameNames("gabe", {
      //prefix: "misa-left-walk.",
      start: 12,
      end: 14,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "pedro-right-walk",
    frames: anims.generateFrameNames("gabe", {
      //prefix: "misa-left-walk.",
      start: 24,
      end: 26,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "pedro-front-walk",
    frames: anims.generateFrameNames("gabe", {
      //prefix: "misa-left-walk.",
      start: 0,
      end: 2,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "pedro-back-walk",
    frames: anims.generateFrameNames("gabe", {
      //prefix: "misa-left-walk.",
      start: 36,
      end: 38,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims2 = crear.anims;
  anims2.create({
    key: "paqui-left-walk",
    frames: anims.generateFrameNames("varios", {
      start: 27,
      end: 29,
    }),
    repeat: -1
  });
  anims2.create({
    key: "paqui-right-walk",
    frames: anims.generateFrameNames("varios", {
      start: 39,
      end: 41,
    }),
    repeat: -1
  });
  anims2.create({
    key: "paqui-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 3,
      end: 5,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims2.create({
    key: "paqui-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 39,
      end: 41,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims3 = crear.anims;
  anims3.create({
    key: "pepe-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 18,
      end: 20,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "pepe-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 30,
      end: 32,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "pepe-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 6,
      end: 8,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "pepe-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 42,
      end: 44,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  const anims4 = crear.anims;
  anims4.create({
    key: "maria-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 21,
      end: 23,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "maria-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 33,
      end: 35,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "maria-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 9,
      end: 11,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "maria-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 45,
      end: 47,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  const anims5 = crear.anims;
  anims5.create({
    key: "marcelo-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 60,
      end: 62,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "marcelo-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 72,
      end: 74,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "marcelo-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 48,
      end: 50,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "marcelo-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 84,
      end: 85,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  const anims6 = crear.anims;
  anims6.create({
    key: "pilar-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 63,
      end: 65,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "pilar-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 75,
      end: 77,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "pilar-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 51,
      end: 53,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "pilar-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 87,
      end: 89,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  const anims7 = crear.anims;
  anims7.create({
    key: "antonio-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 66,
      end: 68,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "antonio-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 78,
      end: 80,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "antonio-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 54,
      end: 56,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "antonio-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 90,
      end: 92,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  const anims8 = crear.anims;
  anims8.create({
    key: "paula-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 69,
      end: 71,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "paula-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 81,
      end: 83,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "paula-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 57,
      end: 59,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "paula-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 93,
      end: 95,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  // const camera = this.cameras.main;
  // camera.startFollow(player);
  // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = crear.input.keyboard.createCursorKeys();
  lanzarJugador(ws.numJugador);
  ws.estoyDentro();

  // Help text that has a "fixed" position on the screen
  // this.add
  //   .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
  //     font: "18px monospace",
  //     fill: "#000000",
  //     padding: { x: 20, y: 10 },
  //     backgroundColor: "#ffffff"
  //   })
  //   .setScrollFactor(0)
  //   .setDepth(30);

  // Debug graphics
  // this.input.keyboard.once("keydown_D", event => {
  //   // Turn on physics debugging to show player's hitbox
  //   this.physics.world.createDebugGraphic();

  //   // Create worldLayer collision graphic above the player, but below the help text
  //   const graphics = this.add
  //     .graphics()
  //     .setAlpha(0.75)
  //     .setDepth(20);
  //   worldLayer.renderDebug(graphics, {
  //     tileColor: null, // Color of non-colliding tiles
  //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  //   });
  // });
}

function lanzarJugador(numJugador) {
  // player = crear.physics.add
  //   .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
  //   .setSize(30, 40)
  //   .setOffset(0, 24);
  //
  player = crear.physics.add.sprite(spawnPoint.x, spawnPoint.y, "varios", recursos[numJugador].id);

  //player2 = crear.physics.add.sprite(spawnPoint.x+15, spawnPoint.y,"varios",3);

  //player.play("walk");

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  crear.physics.add.collider(player, worldLayer);
  //crear.physics.add.collider(player2, worldLayer);

  camera = crear.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

}

function lanzarJugadorRemoto(nick, numJugador) {
  var frame = recursos[numJugador].frame;
  jugadores[nick] = crear.physics.add.sprite(spawnPoint.x, spawnPoint.y, "varios", frame);
  crear.physics.add.collider(jugadores[nick], worldLayer);
}

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  const nombre = recursos[1].nombre;

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);
  //player2.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play(nombre + "-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play(nombre + "-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play(nombre + "-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play(nombre + "-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    // if (prevVelocity.x < 0) player.setTexture("gabe", "gabe-left-walk");
    // else if (prevVelocity.x > 0) player.setTexture("gabe", "gabe-right-walk");
    // else if (prevVelocity.y < 0) player.setTexture("gabe", "gabe-back-walk");
    // else if (prevVelocity.y > 0) player.setTexture("gabe", "gabe-front-walk");
  }
}