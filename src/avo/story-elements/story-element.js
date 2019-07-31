class StoryElement {
  constructor (app) {
    this._app = app;
    
    // Expired elements are removed at the end of the cycle.
    this._expired = false;
    
    this.x = 0;
    this.y = 0;
    this.sizeX = 48;
    this.sizeY = 48;
  }
  
  play () {}
  
  paint () {}
}

export default StoryElement;
