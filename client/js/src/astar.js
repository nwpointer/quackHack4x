var MAPSIZE = 100;

function PathNode(location, heuristic, cost, parent){
	return{
		location:location,
		heuristic:heuristic,
		cost:cost,
		parent:parent
	}
}

function getHeuristic(newLocation, finish) {

	if (newLocation[0] < 0 || newLocation[1] < 0 || newLocation[0] > MAPSIZE || newLocation[1] > MAPSIZE) {
		return 99999;
	}
	return Math.sqrt(Math.pow(Math.abs(newLocation[0] - finish[0])*10, 2) + Math.pow((Math.abs(newLocation[1] - finish[1])*10), 2));
}

function inClosedList(newLocation, closedList) {
	// console.log("location is: ", newLocation);
	for (var i = 0; i < closedList.length; i++) {
		if (newLocation[0] == closedList[i].location[0]) {
			if (newLocation[1] == closedList[i].location[1]) {
				console.log(newLocation," is in the closed list.");
				return true;
			}
		}
	}
	return false;
}

//1 is bottom left, 8 is top right
function createPath(node, start) {
	var path = [];
	var to = node;
	var from;

	while ( !(to.location[0] == start[0] && to.location[1] == start[1] ) ) {
		console.log("to node: ", to);

		from = to.parent;
		var xMove = to.location[0] - from.location[0];
		var yMove = to.location[1] - from.location[1];
		if (xMove < 0) {
			if (yMove < 0) {
				path.push(1); //move down and to the left
			} else if (yMove > 0) {
				path.push(6); //move up and to the left
			} else {
				path.push(4); //move to the left
			}
		} else if (xMove > 0) {
			if (yMove < 0) {
				path.push(3); //move down and to the right
			} else if (yMove > 0) {
				path.push(8); //move up and to the right
			} else {
				path.push(5); //move to the right
			}
		} else { //xMove == 0, no horizontal movement
			if (yMove < 0) {
				path.push(2); //move down
			} else if (yMove > 0) {
				path.push(7); //move up
			} else {
				// console.log("createPath: next move not found");
			}
		}
		to = from;

	}


	return path;
}

function scanSurround(node, finish, closedList, openList) {
	if(node.location){
		var X = node.location[0];
		var Y = node.location[1];
		var newLocation;
	}
	else
	{
		console.log("badWrong");
		return;
	}
	
	for (var i = -1; i < 2; i++) {
		for (var j = -1; j < 2; j++) {
			var newCost = 99999;
			newLocation = [(X+i),(Y+j)];
			//TODO: do inbounds checking here.
			// console.log("from scanSurround, newLocation: ", newLocation);
			if (newLocation[0] < 0 || newLocation[0] > MAPSIZE || newLocation[1] < 0 || newLocation[1] > MAPSIZE) {
				// newCost = 99999;
				if (!inClosedList(newLocation,closedList)) {
					closedList.push(PathNode(newLocation,getHeuristic(newLocation, finish), 99999, null));
				}
			} else if (i == 0 && j == 0) {
				//Where I am now
			} else if (i == 0 || j == 0) {
				newCost = 10;
			} else {
				newCost = 14;
			}
			//TODO: add terrain cost calcs here.
			// var inList = closedList.location.indexOf(newLocation);
			if (!inClosedList(newLocation, closedList)) {

				var newNode = PathNode(newLocation, getHeuristic(newLocation, finish), node.cost + newCost, node);
				openList.push(newNode);
				openList.sort(function (a,b) {return ((a.cost+a.heuristic) - (b.cost + b.heuristic))} );

			}
		}
	}
			// console.log("open list: ", openList);

}

module.exports = function(start, finish) {
	var openList = [];
	var closedList = [];
	var begin = PathNode(start, getHeuristic(start,finish), 0, null);
	openList.push(begin);

	while(openList.length > 0) {
		// openList.sort(function (a,b) {return ((a.cost+a.heuristic) < (b.cost + b.heuristic))} );
		// console.log("openList is ", openList);
		// var temp = openList.slice(0,1);
		var temp = openList.shift();
		openList.sort(function (a,b) {return ((a.cost+a.heuristic) - (b.cost + b.heuristic))} );
		// if (temp[0].location[0] == finish[0] && temp[0].location[1] == finish[1]) {
			if (temp.heuristic == 0) {
			//follow parent links back to start, generate breadcrumbs
			return createPath(temp, start);
		}
		else {
			closedList.push(temp);
			scanSurround(temp, finish, closedList, openList);
			// console.log("exiting scanSurround ", openList, closedList);

		}
	}
}



// function main() {
// 	console.log("Let's run A*");
// 	var list = aStar([0,0],[0,10]);
// 	console.log("the path is: ",list);
// }
// main();