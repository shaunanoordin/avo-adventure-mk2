import ActionMode from '@avo/action-mode';
import InteractionMode from '@avo/interaction-mode';
import Story from '@avo/story';
import Map from '@avo/map';
import { FRAMES_PER_SECOND, MODES } from '@avo/misc/constants';

class AvoAdventure {
  constructor (story) {
    this.mode = MODES.INITIALISING;
    this.nextMode = undefined;  // When asked to change modes, it's queued instead of instant.
    
    this.actors = [];
    this.particles = [];
    this.assets = {};
    this.data = {};
    this.map = new Map(this);
    
    this.camera = {
      x: 0,
      y: 0,
      targetActor: null,  // Sets an Actor to follow. If null, camera is static.
    };
    this.playerActor = null;
    
    this.actionMode = new ActionMode(this);
    this.interactionMode = new InteractionMode(this);
    
    // Initialise the story
    this.story = story || new Story(this);
    
    this.nextFrame = null;
    this.main();
  }
  
  changeMode (nextMode) {
    this.nextMode = nextMode;
  }
  
  _changeMode () {
    if (this.mode === MODES.ACTION) this.actionMode.unload();
    if (this.mode === MODES.INTERACTION) this.interactionMode.unload();
    
    if (this.nextMode === MODES.ACTION) this.actionMode.load();
    if (this.nextMode === MODES.INTERACTION) this.interactionMode.load();
    
    this.mode = this.nextMode;
    this.nextMode = undefined;
  }
  
  /*  Each main step is a 'frame' in the game
   */
  main () {
    if (this.mode === MODES.INITIALISING) this.startStoryIfReady();
    if (this.nextMode) this._changeMode()
    
    // Run game logic and update game visuals
    // Note: gameplay and visual frames are tied.
    this.play();
    this.paint();
    this.cleanUp();
    
    this.nextFrame = setTimeout(this.main.bind(this), 1000 / FRAMES_PER_SECOND);
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
    this.actors = this.actors.filter(actor => !actor._expired);
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
