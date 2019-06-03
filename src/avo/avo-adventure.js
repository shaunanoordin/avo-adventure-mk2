import ActionMode from './action-mode';
import Story from './story';
import { FRAMES_PER_SECOND, MODES } from './constants';

class AvoAdventure {
  constructor (story) {
    this.mode = MODES.INITIALISING;
    
    this.actors = {};
    this.assets = {};
    this.playerActor = null;

    this.actionMode = new ActionMode(this);
    
    this.input = {
      keysPressed: {}
    };
    
    // Initialise the story
    this.story = story || new Story(this);
    
    this.nextFrame = null;
    this.runFrame();
  }
  
  changeMode (newMode) {
    if (this.mode === MODES.ACTION) this.actionMode.unload(this);
    
    if (newMode === MODES.ACTION) this.actionMode.load(this);
    
    this.mode = newMode;
  }
  
  /*  Each frame is a 'step' in the game
   */
  runFrame () {
    if  (this.mode === MODES.INITIALISING) this.startStoryIfReady();
    
    // Run game logic and update game visuals
    // Note: gameplay and visual frames are tied.
    this.play();
    this.paint();
    
    this.nextFrame = setTimeout(this.runFrame.bind(this), 1000 / FRAMES_PER_SECOND);
  }
  
  /*  Run game logic
   */
  play () {
    const story = this.story;
    
    if (!story.skipPlay()) {
      if (this.mode === MODES.ACTION) this.actionMode.play(this);
    }
    
    story.customPlay(this);
  }

  /*  Update game visuals
   */
  paint () {
    const story = this.story;
    
    if (!story.skipPaint()) {
      if (this.mode === MODES.ACTION) this.actionMode.paint(this);
    }

    story.customPaint(this);
  }
  
  /*  Check if Story is ready to start
   */
  startStoryIfReady () {
    if (this.mode !== MODES.INITIALISING) return;
    
    // Assets Check
    let allAssetsLoaded = true;
    Object.keys(this.assets).forEach((id) => {
      const asset = this.assets[id];
      allAssetsLoaded = allAssetsLoaded && asset.loaded;
    });
    
    if (allAssetsLoaded) {
      this.story.start(this);
    }
  }
}

export default AvoAdventure;
