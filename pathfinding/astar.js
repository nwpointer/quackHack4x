function PathNode(location, heuristic, cost, parent){
	return{
		location:location,
		heuristic:heuristic,
		cost:cost,
		parent:parent
	}
}

function getHeuristic(newLocation, finish) {
	return Math.abs(newLocation[0] - finish[0]) + Math.abs(newLocation[1] - finish[1]);
}


//1 is bottom left, 8 is top right
function createPath(node, start) {
	var path = [];
	var to = node;
	while ( node != start ) {
		var from = node.parent;
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
				console.log("createPath: next move not found");
			}
		}

	}


	return path;
}

function scanSurround(node, finish) {
	var X = node.location[0];
	var Y = node.location[1];
	for (i = -1; i < 2; i++) {
		for (j = -1; j < 2; j++) {
			var newCost = 0;
			var newLocation = [(X+i),(Y+j)];
			//do inbounds checking here.
			if (i == 0 || j == 0) {
				newCost = 10;
			} else {
				newCost = 14;
			}
			var inList = closedList.location.indexOf(newLocation);
			if (inList < 0) {
				var newNode = PathNode(newLocation, getHeuristic(newLocation, finish),node.cost + newCost, node);
				openList.push(newNode);
			}
		}
	}
}

function aStar(start, finish) {
	var openList = [];
	var closedList = [];
	var begin = PathNode(start, 0, 0, null);
	openList.push(begin);
	openList.sort(function (a,b) {return ((a.cost+a.heuristic) < (b.cost + b.heuristic))} )

	while(openList.length != 0) {
		var temp = openList.slice(0,1);
		if (temp.location == finish) {
			//follow parent links back to start, generate breadcrumbs
			//createPath();
		}
		else {
			closedList.push(temp);
			scanSurround(temp, finish);
		}
	}
}