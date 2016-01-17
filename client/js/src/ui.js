window.React = require('react');
window.ReactDOM = require('react-dom');

var BottomBar = React.createClass({
	getInitialState: function(){
  	return {
    	numGold: 100,
      trtDisabled: false,
      creepText: "Charging the Creepers",
      creepDisabled: true,
      creepCount: 0,
      turretImg: "turret.png",
      widthOne: 0,
      widthTwo: 0,
      widthThree: 0
    }
  },
  
  componentDidMount: function() {
  	setTimeout(this.incrementAllCounters,1000);
  },
  
  incrementAllCounters: function (){
  	this.setState({
    	numGold: this.state.numGold + 1,
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
    
  launchCreeps: function() {
    this.setState({
      creepCount: 0,
        widthThree: 0,
        widthTwo: 0,
        widthOne: 0,
        creepText: "Charging the Creepers",
        creepDisabled: true
    })
  },
  
  countersChanged: function() {
    if (this.state.numGold >= 50) {
      this.setState({
    		trtDisabled: false,
            turretImg: "turret.png"
      });
    } else {
	    this.setState({
    		trtDisabled: true,
            turretImg: "dimturret.png"
      });
    }
    if (this.state.creepCount >= 30) {
        this.setState({
            widthThree: 100,
            creepText: "10 Creeps Ready to Launch!"
        })
    } else if (this.state.creepCount >= 20) {
        this.setState({
            widthThree: widthThree + 10,
            widthTwo: 100,
            creepText: "3 Creeps Ready to Launch"
        })
    } else if (this.state.creepCount >= 10) {
        this.setState({
            widthTwo: widthTwo + 10,
            widthOne: 100,
            creepText: "1 Creep Ready to Launch",
            creepDisabled: false
        })
    } else {
        this.setState({
            widthThree: 0,
            widthTwo: 0,
            widthOne: widthOne + 10,
            creepText: "Charging eht Creepers",
            creepDisabled: true
        })
    }
  },
  
  render: function() {
  	return(
    	<div> 
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="style.css" />
        <div className="numcoins">
            {this.state.numGold} 
        </div>
        
        <div className="coins">
            <img id="coin-img" src="coins.png" alt="Coins" />
        </div>
        
        <div className="turret-bank">
            <button onClick={this.placeTurret} disabled={this.state.trtDisabled} >
                <img id="turret-img" src={this.state.turretImg} alt="Plain Turret - 50g" id="trtbtn" />
            </button>
        </div>
        <div className="chargingbar" width="1000" height="1000" style={{background: 'red', display: 'inline-block'}} > bar </div>
        <div className="fire-creep">
            <button disabled={this.state.creepDisabled} id="firebtn" type="button" className="btn btn-default" onClick={this.launchCreeps}>
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