let slowmo=false
let man;
let manSprites;
let manAnis = {
  moveDown:{
    row:0,
    frames:12,
  },
  moveLeft:{
    row:1,
    frames:12,
  },
  moveRight:{
    row:2,
    frames:12,
  },
moveUp:{
  row:3,
  frames:12,
}};

let tilefloorImage;
let tilefloor;
let blockImage;
let platformImage;
let spikeImage;
let spikes;
let platforms;
let gamestate="intro"
let blocks;
let level=[
  "bbbbbbbbbbbbbbbbbbbbbbbbb",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________________b",
  "b_______________b__b____b",
  "b_______________bppb____b",
  "b_______________________b",
  "b_____________________bbb",
  "b_______________________b",
  "b_______________________b",
  "bssss_________bbb_______b",
  "bbbbbbbbbbbbbbbbbbbbbbbbb",
  
  
]
let attackRadius
//------------------------------
function preload(){
  tilefloorImage=loadImage("tilefloor.png")
  manSprites=loadImage("man.png")
  blockImage=loadImage("block.png")
  platformImage=loadImage("platform.png")
  spikeImage=loadImage("spike.png")
}
//-----------------------------
function setup() {
  new Canvas(200,200,"pixelated");

  blocks=new Group();
  blocks.image=blockImage;
  blocks.tile="b";
  blocks.collider="static";

  platforms=new Group();
  platforms.image=platformImage;
  platforms.tile="p";
  platforms.collider="none";

  tilefloor=new Group();
  tilefloor.image=tilefloorImage;
  tilefloor.tile="_";
  tilefloor.collider="none";
  
  spikes=new Group();
  spikes.image=spikeImage;
  spikes.tile="s";
  spikes.collider="static";

  allSprites.autoDraw=false;
  allSprites.autoUpdate=false;
  world.autoStep=false;
//------------------------------------------------------------

//------------------------------------------------------------------------
  //aallSprites.debug=true;
  allSprites.pixelPerfect=true;
  man=new Sprite(80,160);
  man.spriteSheet=manSprites;
  man.anis.w=95.5;
  man.anis.h=160
  man.addAnis(manAnis);
  man.w=50;
  man.h=150
  man.anis.offset.y=0
  man.rotationLock = true
  man.scale=0.3
  manSensor= new Sprite();
  manSensor.x=man.x
  manSensor.y=man.y+man.h/2
  manSensor.w=13
  manSensor.h=6
  manSensor.collider= "none"
  manSensor.visible= false;
    let j= new GlueJoint (manSensor, man)
  j.visible=false

new Tiles(level, 0, 0, 16, 16);
  

  
  attackRadius=new Sprite()
  attackRadius.d=75
  attackRadius.x=man.x
  attackRadius.y=man.y
  attackRadius.collider="none"
  attackRadius.visible=false
  let arj=  new GlueJoint (man, attackRadius)
  arj.visible=false
}

//-----------------------------
function draw() {
  if(gamestate=="intro") intro();
  if (gamestate=="runGame") runGame();
  if (gamestate=="gameOver") gameOver();
  
}

function intro(){
  cursor(HAND)
  camera.off()
  background("red")
  text("click the screen to start", 100,100)
   textAlign(CENTER,CENTER)
  if (mouse.presses()){
    gamestate="runGame"
  }
}
function gameOver(){
  cursor(ARROW)
  camera.off()
  background("red")
  text("GAME OVER\n press enter to play again", 100, 100)
  textAlign(CENTER, CENTER)
  if (kb.presses("enter")){
    man.x=80
    man.y=160
    console.log("then why ain't this working")
    gamestate="runGame"
  }
  world.step()
}

function runGame(){
  camera.on()
  man.vel.x=0;
    man.vel.y=0;
    man.ani.stop()
  background("slategray")

    if (kb.pressing("right")||kb.pressing("d")) {
      man.ani.play()
      man.changeAni("moveRight")
      if(kb.pressing("shift")&&!slowmo){
        man.vel.x=2.5
      }else man.vel.x= 1.5;
    }
    else if (kb.pressing("left")||kb.pressing("a")){
      man.ani.play()
        man.changeAni("moveLeft")
      if(kb.pressing("shift")&&!slowmo){
        man.vel.x=-2.5
      }else man.vel.x= -1.5;
      }
    else if (kb.pressing("up")||kb.pressing("w")){
      man.ani.play()
      man.changeAni("moveUp")
      if(kb.pressing("shift")&&!slowmo){
        man.vel.y=-2.5
      }else man.vel.y= -1.5;
    }
    else if ((kb.pressing("down")||kb.pressing("s"))&&!manSensor.overlapping(blocks)&&!manSensor.overlapping(platforms)){
      man.ani.play()
      man.changeAni("moveDown")
      if(kb.pressing("shift")&&!slowmo){
        man.vel.y=2.5
      }else man.vel.y= 1.5;
    }
  if (manSensor.overlapping(spikes)){
    gamestate="gameOver"
  }
  if (kb.pressing("c")){
  world.timeScale=0.3
    man.ani.frameDelay=15
    slowmo=true
  } else {
    world.timeScale=1
    man.ani.frameDelay=4
    slowmo=false
  }
  noCursor()
  async function practice() {
    await man.changeAni('moveDown');
    man.changeAni('moveLeft');
    await man.move(60, 180, 1);

    await man.changeAni('moveUp');
    man.changeAni('moveLeft');
    man.ani.frame = 1;
    await man.move(60, 0, 1);

  }
  
   //cursor("cursor.png",16.5,16)

  allSprites.update();
  //allSprites.draw()
  spriteOrder()
  world.step();
  if (kb.pressing("z")){
    camera.zoom=1.5
    camera.x=constrain(man.x, 59, 325)
    camera.y=constrain(man.y, 59, 261)
    circle(mouse.x, mouse.y, 5/1.17)
    strokeWeight(0)}
  else {camera.zoom=1
    camera.x=constrain(man.x, 92, 292)
    camera.y=constrain(man.y, 92, 228)
    circle(mouse.x, mouse.y, 5)
    strokeWeight(4)}
}

function spriteOrder(){
  tilefloor.draw();
  platforms.draw();
  blocks.draw();
  spikes.draw();
  man.draw();
  
}

