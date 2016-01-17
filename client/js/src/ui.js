window.React = require('react');
window.ReactDOM = require('react-dom');
var howl = require('howler');

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
      widthThree: 0,
      turretReadySoundPlayed: true
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
        numGold: this.state.numGold - 50,
        turretReadySoundPlayed: false
      })
      this.countersChanged();
      var sound = new howl.Howl({
        urls: ['media/turret-drop.ogg']
      }).play();
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
    });
    if (this.state.creepCount >= 30) {
        var sound = new howl.Howl({
            urls: ['media/multiple-creepers.ogg']
        }).play();
    } else if (this.state.creepCount >= 20) {
        var sound = new howl.Howl({
            urls: ['media/release-three-creep.ogg']
        }).play();
    } else if (this.state.creepCount >= 10) {
        var sound = new howl.Howl({
            urls: ['media/release-single-creep.ogg']
        }).play();
    } 
  },
  
  countersChanged: function() {
    if (this.state.numGold >= 50) {
      this.setState({
    		trtDisabled: false,
            turretImg: "turret.png"
      });
      if (!this.state.turretReadySoundPlayed) {
          var sound = new howl.Howl({
                urls: ['media/turret-ready.ogg']
          }).play();
          this.setState({
              turretReadySoundPlayed: true
          });
      }
    } else {
	    this.setState({
    		trtDisabled: true,
            turretImg: "dimturret.png"
      });
    }
    if (this.state.creepCount >= 30) {
        this.setState({
            widthThree: "100%",
            creepText: "10 Creeps Ready to Launch!"
        })
    } else if (this.state.creepCount >= 20) {
        this.setState({
            widthThree: this.state.widthThree + 10,
            widthTwo: 100,
            creepText: "3 Creeps Ready to Launch"
        })
    } else if (this.state.creepCount >= 10) {
        this.setState({
            widthTwo: this.state.widthTwo + 10,
            widthOne: 100,
            creepText: "1 Creep Ready to Launch",
            creepDisabled: false
        })
    } else {
        this.setState({
            widthThree: 0,
            widthTwo: 0,
            widthOne: this.state.widthOne + 10,
            creepText: "Charging the Creepers",
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
        <div className="chargingbarone" style={{background: 'blue', display: 'inline-block', height:"100px", width:this.state.widthOne+"%"}} ></div>
        <div className="chargingbartwo" style={{background: 'green', display: 'inline-block', height:"100px", width:this.state.widthTwo+"%"}} ></div>
        <div className="chargingbarthree" style={{background: 'red', display: 'inline-block', height:"100px", width:this.state.widthThree+"%"}} ></div>
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