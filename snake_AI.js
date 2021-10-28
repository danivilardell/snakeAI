var dist;
var mapaDespres;

function bfs(applePos) {
	var Q = new Queue();
	dist[applePos[0]][applePos[1]] = 0;

	Q.enqueue(applePos);
	while(!Q.isEmpty()) {
		var n = Q.dequeue();

		for(var i = 0; i < 4; i++) {
			if(MOVE_X[i] + n[0] >= 0 && MOVE_X[i] + n[0] < GAME_SIZE &&
				MOVE_Y[i] + n[1] >= 0 && MOVE_Y[i] + n[1] < GAME_SIZE &&
				dist[MOVE_X[i] + n[0]][MOVE_Y[i] + n[1]] == -1 && 
				currBoard[MOVE_X[i] + n[0]][MOVE_Y[i] + n[1]] != 1) { // 

				dist[MOVE_X[i] + n[0]][MOVE_Y[i] + n[1]] = dist[n[0]][n[1]] + 1;
				Q.enqueue([n[0] + MOVE_X[i], n[1] + MOVE_Y[i]]);
			}
		}
	}
}

function tanca(pos_i, pos_j) {
	mapaDespres = Array(GAME_SIZE).fill().map(()=>Array(GAME_SIZE).fill())
	for(var i = 0; i < GAME_SIZE; i++) {
		for(var j = 0; j < GAME_SIZE; j++) {
			mapaDespres[i][j] = currBoard[i][j];
		}
	}

	mapaDespres[pos_i][pos_j] = 1;

	var pintat = false;

	for(var i = 0; i < GAME_SIZE; i++) {
		for(var j = 0; j < GAME_SIZE; j++) {
			if(mapaDespres[i][j] == 0) {
				pinta(i, j);
				pintat = true;
				break;
			}
		}
		if(pintat) break;
	}

	for(var i = 0; i < GAME_SIZE; i++) {
		for(var j = 0; j < GAME_SIZE; j++) {
			if(mapaDespres[i][j] == 0) {
				return true;
			}
		}
	}
	return false;
}

function pinta(pos_i, pos_j) {
	if(pos_i < 0 || pos_j < 0 || pos_i >= GAME_SIZE || pos_j >= GAME_SIZE || mapaDespres[pos_i][pos_j] == 1) return;
	if(mapaDespres[pos_i][pos_j] == 0) mapaDespres[pos_i][pos_j] = 1;

	for(var i = 0; i < 4; i++) pinta(pos_i + MOVE_X[i], pos_j + MOVE_Y[i]);
}

function getNextMoveAI(_callback) {
	var applePos;
	dist = Array(GAME_SIZE).fill().map(()=>Array(GAME_SIZE).fill());
	for(var i = 0; i < GAME_SIZE; i++) {
		for(var j = 0; j < GAME_SIZE; j++) {
			dist[i][j] = -1;
			if(currBoard[i][j] == 2) applePos = [i, j];
		}
	}

	bfs(applePos);

	var headPosition = snakePosition.head();
	var minDist = GAME_SIZE*GAME_SIZE;

	for(var i = 0; i < 4; i++) {
		var next_i = MOVE_X[i] + headPosition[0], next_j = MOVE_Y[i] + headPosition[1];
		if(next_i >= 0 && next_i < GAME_SIZE && next_j >= 0 && next_j < GAME_SIZE && dist[next_i][next_j] < minDist &&
				dist[next_i][next_j] != -1 && !tanca(next_i, next_j)) {
			minDist = dist[next_i][next_j];
			lastClick = i;

		}
	}
	
	if(minDist == GAME_SIZE*GAME_SIZE) {
		console.log("hola")
		for(var i = 0; i < 4; i++) {
			var next_i = MOVE_X[i] + headPosition[0], next_j = MOVE_Y[i] + headPosition[1];
			if(next_i >= 0 && next_i < GAME_SIZE && next_j >= 0 && next_j < GAME_SIZE && currBoard[next_i][next_j] != 1 && 
					!tanca(next_i, next_j)) {
				lastClick = i;
				_callback();
			}
		}

		minDist = GAME_SIZE*GAME_SIZE;
		for(var i = 0; i < 4; i++) {
			var next_i = MOVE_X[i] + headPosition[0], next_j = MOVE_Y[i] + headPosition[1];
			if(next_i >= 0 && next_i < GAME_SIZE && next_j >= 0 && next_j < GAME_SIZE && dist[next_i][next_j] < minDist &&
					dist[next_i][next_j] != -1) {
				minDist = dist[next_i][next_j];
				lastClick = i;
			}
		}

		if(minDist == GAME_SIZE*GAME_SIZE) {
			console.log("hola2")
			for(var i = 0; i < 4; i++) {
				var next_i = MOVE_X[i] + headPosition[0], next_j = MOVE_Y[i] + headPosition[1];
				if(next_i >= 0 && next_i < GAME_SIZE && next_j >= 0 && next_j < GAME_SIZE && currBoard[next_i][next_j] != 1) {
					console.log("hola3");
					lastClick = i;
					_callback();
					return;
				}
			}
		}
	}

	_callback();   

}