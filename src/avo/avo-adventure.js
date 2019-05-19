import ActionPane from './action-pane';
import Story from './story';
import { FRAMES_PER_SECOND, MODES } from './constants';

class AvoAdventure {
  constructor (story) {
    this.mode = MODES.INITIALISING;
    this.state = '';
    
    this.actors = {};
    this.assets = {};

    this.actionPane = new ActionPane(this);
    
    this.input = {
      keysPressed: {}
    };
    
    // Initialise the story
    this.story = story || new Story(this);
    
    this.nextPlay = null;
    this.play();
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
      if (this.mode === MODES.ACTION) this.actionPane.play(this);
    }
    
    //
    story.postPlay();
    // --------------------------------
    
    // Update visuals
    // Note: gameplay and visual frames are tied. 
    this.paint();
    
    // Next step
    this.nextPlay = setTimeout(this.play.bind(this), 1000 / FRAMES_PER_SECOND);
  }
  
  paint () {
    const story = this.story;
    
    story.prePaint();

    if (!story.skipPaint()) {
      if (this.mode === MODES.ACTION) this.actionPane.paint(this);
    }

    story.postPaint();
  }
}

export default AvoAdventure;
