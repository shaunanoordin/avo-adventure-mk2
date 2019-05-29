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
  
  /*  Each frame is a 'step' in the game
   */
  runFrame () {
    if  (this.mode === MODES.INITIALISING) this.startStoryIfReady();
    
    // Run game logic
    this.play();
    
    // Update visuals
    // Note: gameplay and visual frames are tied. 
    this.paint();

    // Next step
    this.nextFrame = setTimeout(this.runFrame.bind(this), 1000 / FRAMES_PER_SECOND);
  }
  
  /*  Run game logic
   */
  play () {
    const story = this.story;
    
    story.prePlay();
    
    // Run the main 
    if (!story.skipPlay()) {
      if (this.mode === MODES.ACTION) this.actionMode.play(this);
    }
    
    story.postPlay();
  }

  /*  Update game visuals
   */
  paint () {
    const story = this.story;
    
    story.prePaint();

    if (!story.skipPaint()) {
      if (this.mode === MODES.ACTION) this.actionMode.paint(this);
    }

    story.postPaint();
  }
  
  /*  Check if Story is ready to start
   */
  startStoryIfReady () {
    if (this.mode !== MODES.INITIALISING) return;
    
    // Assets Check
    let allAssetsLoaded = true;
    Object.keys(this.assets).forEach((key) => {
      const asset = this.assets[key];
      allAssetsLoaded = allAssetsLoaded && asset.loaded;
    });
    
    if (allAssetsLoaded) {
      this.story.start(this);
    }
  }
}

export default AvoAdventure;
