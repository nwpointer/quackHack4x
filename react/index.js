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
    this.goldChanged();
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
    	<div> {this.state.numGold} Gold 
      <br/>
      <button onClick={this.placeTurret} disabled={this.state.trtDisabled}> Place Turret</button>
      <br/>
      <button disabled={this.state.creepDisabled}>{this.state.creepText}</button>
      </div>
    );
  }
});

ReactDOM.render(
	<BottomBar />,
  document.getElementById('container')
);