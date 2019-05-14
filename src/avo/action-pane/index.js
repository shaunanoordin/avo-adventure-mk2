class ActionPane {
  constructor (app) {
    this.app = app;
    this.html = document.getElementById('action-pane');
    
    this.html.onkeydown = this.onKeyDown.bind(this);
    this.html.onkeyup = this.onKeyUp.bind(this);
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
