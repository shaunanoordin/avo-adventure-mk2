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
    
    story.prePlay();
    
    if (!story.skipPlay()) {
      // ...
    }
        
    story.postPlay();
    
    // Play and Paint are tied. 
    this.paint();
    
    // Next step
    this.nextPlay = setTimeout(this.play.bind(this), 1000 / FRAMES_PER_SECOND);
  }
  
  paint () {
    const story = this.story;
    
    if (this.mode === MODES.ACTION) {
      story.prePaint();
    
      if (!story.skipPaint()) {
        // ...
      }

      story.postPaint();
    }
  }
}

export default AvoAdventure;
