window.React = require('react');
window.ReactDOM = require('react-dom');

var BottomBar = React.createClass({
	getInitialState: function(){
  	return {
    	numGold: 100,
      trtDisabled: false,
      creepText: "Charging the Creepers",
      creepDisabled: true,
      creepCount: 0
    }
  },
  
  componentDidMount: function() {
  	setTimeout(this.incrementGold,1000);
  },
  
  incrementGold: function (){
  	this.setState({
    	numGold: this.state.numGold + 1
    });
    this.goldChanged();
    setTimeout(this.incrementGold,1000);
  },
  
  placeTurret: function() {
  	if (this.state.numGold >= 50) {
      this.setState({
        numGold: this.state.numGold - 50
      })
      this.goldChanged();
    }
  },
  
  goldChanged: function() {
    if (this.state.numGold >= 50) {
      this.setState({
    		trtDisabled: false
      });
    } else {
	    this.setState({
    		trtDisabled: true
      });
    }
  },
  
  render: function() {
  	return(
    	<div> 
        {this.state.numGold} 
        <img id="coin-img" src="coins.png" alt="Coins" />
        <button onClick={this.placeTurret} disabled={this.state.trtDisabled}>
          <img id="turret-img" src="turret.png" alt="Plain Turret - 50g" />
        </button>
        <br />
        <button disabled={this.state.creepDisabled}>{this.state.creepText}</button>
      </div>
    );
  }
});

ReactDOM.render(
  <BottomBar />,
  document.getElementById('container')
);