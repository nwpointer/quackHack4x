window.React = require('react');
window.ReactDOM = require('react-dom');

var BottomBar = React.createClass({
	getInitialState: function(){
  	return {
    	numGold: 100,
      trtDisabled: false,
      creepText: "Charging the Creepers",
      creepDisabled: true,
      creepCount: 2
    }
  },
  
  componentDidMount: function() {
  	setTimeout(this.incrementAllCounters,1000);
  },
  
  incrementAllCounters: function (){
  	this.setState({
    	numGold: this.state.numGold + 1
        creepCount: this.state.creepCount + 1
    });
    this.countersChanged();
    setTimeout(this.incrementAllCounters,1000);
  },
  
  placeTurret: function() {
  	if (this.state.numGold >= 50) {
      this.setState({
        numGold: this.state.numGold - 50
      })
      this.countersChanged();
    }
  },
  
  countersChanged: function() {
    if (this.state.numGold >= 50) {
      this.setState({
    		trtDisabled: false
      });
    } else {
	    this.setState({
    		trtDisabled: true
      });
    }
    if (this.state.creepCount >= 20) {
        this.setState({
            creepText: "10 Creeps Ready to Launch!"
        })
    } else if (this.state.creepCount >= 9) {
        this.setState({
            creepText: "3 Creeps Ready to Launch"
        })
    } else if (this.state.creepCount >= 3) {
        this.setState({
            creepText: "1 Creep Ready to Launch",
            creepDisabled: true
        })
    } else {
        this.setState({
            creepText: "Charging the Creepers",
            creepDisabled: false
        })
    }
  },
  
  render: function() {
  	return(
    	<div> 
        <div class="numcoins">
            {this.state.numGold} 
        </div>
        
        <div class="coins">
            <img id="coin-img" src="coins.png" alt="Coins" />
        </div>
        
        <div class="turret-bank">
            <button onClick={this.placeTurret} disabled={this.state.trtDisabled}>
                <img id="turret-img" src="turret.png" alt="Plain Turret - 50g" />
            </button>
        </div>
        
        <div class="fire-creep">
            <button disabled={this.state.creepDisabled} id="firebtn" type="button" class="btn btn-default">
                {this.state.creepText}
            </button>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <BottomBar />,
  document.getElementById('container')
);