import ActionMode from './action-mode';
import Story from './story';
import { FRAMES_PER_SECOND, MODES } from './constants';

class AvoAdventure {
  constructor (story) {
    this.mode = MODES.INITIALISING;
    
    this.actors = {};
    this.assets = {};

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
  
  runFrame () {
    // Run game logic
    this.play();
    
    // Update visuals
    // Note: gameplay and visual frames are tied. 
    this.paint();

    // Next step
    this.nextFrame = setTimeout(this.runFrame.bind(this), 1000 / FRAMES_PER_SECOND);
  }
  
  play () {
    const story = this.story;
    
    // Initialising Mode: Assets Check
    // Start the story when all assets are loaded.
    // --------------------------------
    if (this.mode === MODES.INITIALISING) {
      let allAssetsLoaded = true;
      Object.keys(this.assets).forEach((key) => {
        const asset = this.assets[key];
        allAssetsLoaded = allAssetsLoaded && asset.loaded;
      });
      if (allAssetsLoaded) {
        this.story.start(this);
      }
    }
    // --------------------------------
    
    // Game Logic
    // --------------------------------
    story.prePlay();
    
    // Run the main 
    if (!story.skipPlay()) {
      if (this.mode === MODES.ACTION) this.actionMode.play(this);
    }
    
    //
    story.postPlay();
    // --------------------------------
  }
  
  paint () {
    const story = this.story;
    
    story.prePaint();

    if (!story.skipPaint()) {
      if (this.mode === MODES.ACTION) this.actionMode.paint(this);
    }

    story.postPaint();
  }
}

export default AvoAdventure;
