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