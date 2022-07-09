function preload() {
  // start the engine
  Engine.Initialize(Game);

  // connect to the party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "hello_party",
    "main2"
  );

  // init networking
  Game.NetworkVariables = partyLoadShared("vars", Game.NetworkVariables);
}

function mousePressed() {
  Engine.MousePressed();
}

function setup() {
  rectMode(CENTER);
  angleMode(DEGREES);
  createCanvas(config.view_width, config.view_height);
  Engine.Start();
}

function draw() {
  background(255);
  // process input
  if (keyIsPressed) {
    Engine.KeyPressed();
  }
  // update logic
  Engine.Update();
}
