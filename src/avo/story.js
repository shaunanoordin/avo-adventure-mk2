import { MODES } from '@avo/misc/constants';
import { ImageAsset } from '@avo/misc/image-asset';
import Actor from '@avo/story-elements/actor';

class Story {
  constructor (app) {
    this._app = app;
    
    // Assets
    app.assets.basicActor = new ImageAsset('assets/actor-v1.png');
    
    app.playerActor = new Actor(app, { x: 160, y: 120 });
    app.actors.push(app.playerActor);
    
    const testActorA = new Actor(app, { x: 80, y: 120 });
    app.actors.push(testActorA);
    
    // TODO:
    // app.addActor();
    // app.addAsset();
  }
  
  start () {
    const app = this._app;
    console.info('STORY IS READY TO START!');
    app.changeMode(MODES.ACTION);
  }
  
  skipPlay () { return false }
  customPlay () {}
  
  skipPaint () { return false }
  customPaint () {}
}

export default Story;