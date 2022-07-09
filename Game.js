const Game = {
  Assets: [
    {
      name: "player",
      path: "./assets/circle.png",
    },
  ],
  NetworkVariables: {
    position: { x: 100, y: 100 },
  },

  Setup: () => {
    let room = Engine.CreateRoom("room0", 800, 600);

    let circle = new GameObject("circle");
    circle.AddSprite(Engine.GetSprite("player"));
    circle.scale = 0.2;

    circle.Update = () => {
      let pos = Engine.GetNetVar("position");

      circle.x = pos.x;
      circle.y = pos.y;
    };
    circle.OnClick = () => {
      circle.x = mouseX;
      circle.y = mouseY;
      Engine.SetNetVar("position", { x: circle.x, y: circle.y });
    };

    Engine.Instantiate(circle);
  },

  Update: () => {
    // here we update game information, not GameObjects
  },

  OnMousePressed: () => {
    // here we process global mouse pressed events
  },

  OnKeyPressed: (code) => {
    // here we process global key pressed events
  },
};
