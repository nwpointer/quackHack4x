window.React = require('react');
window.ReactDOM = require('react-dom');
var howl = require('howler');

var bgsound = new howl.Howl({
    urls: ['media/AHITU.mp3'],
    autoplay: true,
    loop: true
}).play();

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
    setTimeout(this.incrementChargeBar,100);
  	setTimeout(this.incrementAllCounters,1000);
  },
    
  incrementChargeBar: function() {
    if (this.state.creepCount >= 30) {
        this.setState({
            widthThree: 100,
            creepText: "10 Creeps Ready to Launch!"
        })
    } else if (this.state.creepCount >= 20) {
        this.setState({
            widthThree: this.state.widthThree + 1,
            widthTwo: 100,
            creepText: "3 Creeps Ready to Launch"
        })
    } else if (this.state.creepCount >= 10) {
        this.setState({
            widthTwo: this.state.widthTwo + 1,
            widthOne: 100,
            creepText: "1 Creep Ready to Launch",
            creepDisabled: false
        })
    } else {
        this.setState({
            widthThree: 0,
            widthTwo: 0,
            widthOne: this.state.widthOne + 1,
            creepText: "Charging the Creepers",
            creepDisabled: true
        })
    }
    setTimeout(this.incrementChargeBar,100);
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
  },

  render: function() {
  	return(
    	<div className="aParent" style={{width:'100%'}}> 
            <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
            <link rel="stylesheet" type="text/css" href="style.css" />
        
            <div className="left" style={{float:'left', width: '25%', height:'50px'}}>
                <div className="numcoins" style={{float:'left', width: '25%'}}>
                    {this.state.numGold} 
                </div>
                <div className="coins" style={{float:'left', width: '75%', height: '100%'}}>
                    <img id="coin-img" src="coins.png" alt="Coins" />
                </div>
            </div>
        
            <div className="totalBar" style={{display: 'inline-block', margin:'0 auto', width:'50%'}}>
                
                <div className="fire-creep">
                    <button disabled={this.state.creepDisabled} id="firebtn" type="button" className="btn btn-default" onClick={this.launchCreeps} style={{position: 'relative', width: '100%'}}>
                        {this.state.creepText}
                    </button>
                </div>
            </div>
        
            <div className="turret-bank" style={{float:'right', width:'25%'}}>
                <button className="trtBtttn" onClick={this.placeTurret} disabled={this.state.trtDisabled} style={{float:'right'}}>
                    <img id="turret-img" src={this.state.turretImg} alt="Plain Turret - 50g" id="trtbtn" style={{float:'right'}} />
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