class ActionPane {
  constructor (app) {
    this.html = document.getElementById('action-pane');
    this.canvas2d = this.html.getContext("2d");
    
    // Set HTML
    this.canvasSizeRatio = 1;

    this.html.onkeydown = this.onKeyDown.bind(this);
    this.html.onkeyup = this.onKeyUp.bind(this);
  }
  
  play (app) {
    
  }
  
  paint (app) {
    const assets = app.assets;
    const canvas2d = this.canvas2d;
    
    canvas2d.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    canvas2d.drawImage(assets.basicActor.img, 0, 0, 48, 48, 0, 0, 48, 48);
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (e) {
    console.log(e);
  }
  
  onKeyUp (e) {
    
  }
}

export default ActionPane;
