import ActionMode from '@avo/action-mode';
import Story from '@avo/story';
import { FRAMES_PER_SECOND, MODES } from '@avo/misc/constants';

class AvoAdventure {
  constructor (story) {
    this.mode = MODES.INITIALISING;
    
    this.actors = {};
    this.particles = [];
    this.assets = {};
    this.playerActor = null;
    
    this.camera = { x: 0, y: 0 };

    this.actionMode = new ActionMode(this);
    
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
    this.cleanUp();
    
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
  
  /*  Remove expired elements
   */
  cleanUp () {
    Object.keys(this.actors).forEach(id => {
      if (this.actors[id]._expired) delete this.actors[id];
    });
    
    this.particles = this.particles.filter(particle => !particle._expired);
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
