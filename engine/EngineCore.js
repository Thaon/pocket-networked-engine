//engine
/**
 * assets (image, audio)
 * rooms[]
 * objects[]
 */

//room
/**
 * objects[]
 * backgrounds[] (image)
 * height, width
 * camera
 */

//object
/**
 * sprites[] (image)
 * x, y, rotation, scale
 * Actions ->
 *  - Start
 *  - Update
 *  - Draw
 * Callbacks ->
 *  - OnClick
 *  - OnCollision
 */

//image
/**
 * url
 * width, hegith
 */

//camera
/**
 * x, y
 * width, height
 * zoom
 */

class EngineCore {
  constructor() {
    this.Game = null;
    this.rooms = [];
    this.objects = [];
    this.images = [];
    this.sounds = [];
    this.currentRoom = 0; //the initial or selected room
  }

  //assets
  Initialize = (Game) => {
    /**
     * asset = {
     *   name : string,
     *   path: string
     * }
     */
    this.Game = Game;
    this.images = [];
    this.Game.Assets.forEach((asset, index) => {
      loadImage(
        asset.path,
        (img) => {
          console.log(
            "Loading " + Number(index + 1) + " of " + Game.Assets.length
          );
          this.images.push({ name: asset.name, img });

          if (index == Game.Assets.length - 1) {
            console.log("All loaded");
            return true;
          }
        },
        (err) => {
          console.log(err);
          return false;
        }
      );
    });
  };

  GetSprite = (name) => {
    let sprite = this.images.find((img) => img.name == name);
    if (sprite) {
      return sprite.img;
    } else {
      console.log("Sprite not found");
      return false;
    }
  };

  GetNetVar = (name) => {
    return this.Game.NetworkVariables[name];
  };

  SetNetVar = (name, value) => {
    this.Game.NetworkVariables[name] = value;
  };

  //core
  Start = () => {
    this.Game.Setup();
    this.rooms[this.currentRoom]?.initRoom();
    this.rooms[this.currentRoom]?.objects.forEach((object) => {
      object.Start();
    });
  };

  Update = () => {
    this.rooms[this.currentRoom]?.updateRoom();

    this.Game.Update();

    //draw all GameObject sprites
    this.rooms[this.currentRoom]?.objects.forEach((object) => {
      let sprite = object.sprites[0];
      image(
        sprite,
        object.x,
        object.y,
        sprite.width * object.scale,
        sprite.height * object.scale
      );
    });
  };

  MousePressed = () => {
    this.rooms[this.currentRoom]?.objects.forEach((object) => {
      object.OnClick();
    });
    Game.OnMousePressed();
  };

  KeyPressed = () => {
    Game.OnKeyPressed(keyCode);
  };

  //rooms
  CreateRoom = (roomName, w, h) => {
    let newRoom = new Room({ name: roomName, width: w, height: h });
    this.rooms.push(newRoom);
    return newRoom;
  };

  FindRoom = (roomName) => {
    let room = this.rooms.find((room) => room.name == roomName);
    return room;
  };

  SetCurrentRoom = (roomName) => {
    this.currentRoom = this.rooms.findIndex((room) => room.name == roomName);
    if (this.currentRoom == -1) {
      console.log("Room not found");
    } else {
      this.rooms[this.currentRoom]?.initRoom();
      return this.rooms[this.currentRoom];
    }
  };

  //utility
  Instantiate = (object) => {
    this.rooms[this.currentRoom].objects.push(object);
  };

  Destroy = (object) => {
    this.rooms[this.currentRoom].objects.splice(
      this.rooms[this.currentRoom].objects.indexOf(object),
      1
    );

    //this uses more memory than the above method
    // let newList = this.rooms[this.currentRoom].objects.filter(obj => obj !== object);
    // this.rooms[this.currentRoom].objects = newList;
  };
}

class GameObject {
  constructor(name) {
    this.name = name;
    this.sprites = [];
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scale = 1;
  }

  Start = () => {};
  Update = () => {};
  OnClick = () => {};
  OnCollision = () => {};

  AddSprite = (sprite) => {
    this.sprites.push(sprite);
  };
}

class Room {
  constructor(config) {
    this.name = config.name;
    this.objects = [];
    this.width = config.width;
    this.height = config.height;
    this.camera = null;
  }

  initRoom = () => {
    this.objects.forEach((object) => {
      object.Start();
    });
  };

  updateRoom = (deltaTime) => {
    this.objects.forEach((object) => {
      object.Update(deltaTime);
    });
  };
}

let Engine = new EngineCore();
