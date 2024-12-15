class Board{
    constructor(gridSize){
        this.gridSize = gridSize;
        this.board = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(""));
        this.elementStoneOptions = []
        this.blackTiles = []
        this.moves = []
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if ((i + j) % 2) {
                    if (i < 3) {
                        this.board[i][j] = "w"; 
                    } else if (i > 4) {
                        this.board[i][j] = "r"; 
                    } else {
                        this.board[i][j] = ""; 
                    }
                }
            }
        }

        // this.board[4][3] = "w"
        // this.board[1][6] = ""
        // this.board[1][6] = ""
        // this.board[1][4] = ""
        // this.board[1][0] = ""
        // this.board[0][3] = ""
        
    }

    createBoard(){
        let tileID = 0
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let tempTile = document.createElement("div");
                if((i+j)%2 === 0) {
                    tempTile.style.backgroundColor = "gray"
                }else{
                    tempTile.style.backgroundColor = "black"
                }
                tempTile.className = "tile";
                tempTile.id = tileID;
                boardElement.appendChild(tempTile);
                tileID+=1;
            }
        }
         return document.querySelectorAll(".tile")
    }

    addStones(tilesElements, player1, player2){
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let tempIndex = this.getIndex([i,j])
                if(this.board[i][j] === player1.symbol){
                    tilesElements[tempIndex].textContent = player1.circle
                }else if(this.board[i][j] === player2.symbol){
                    tilesElements[tempIndex].textContent = player2.circle
                }else if(this.board[i][j] === player1.symbol.toUpperCase()){
                    tilesElements[tempIndex].textContent = player1.king
                }else if(this.board[i][j] === player2.symbol.toUpperCase()){
                    tilesElements[tempIndex].textContent = player2.king
                }else{
                    tilesElements[tempIndex].textContent = ""
                }
            }
        }
    }
    getPoseFromIndex(index){
        let x = index % this.gridSize ;
        let y = Math.floor(index / this.gridSize );
        return [x,y];
    }

    getIndex(pose){
        let index = pose[0]*this.gridSize + pose[1];
        return index;
    }

    checkWithinBoundry(x,y){
        if(x>=0 && y >=0 && x<=(this.gridSize-1) && y <=(this.gridSize-1))
            return true
        else {
            return false
        }
    }
    checkNeighbor(pose, direction, opponent, depth=0){
        const avialbleMoves = []
        if (depth > 3) return avialbleMoves;
        for(let i=-1; i <=1; i+=2){
            const x = pose[0]+i
            const y = pose[1]+direction
            if(this.checkWithinBoundry(x,y) /*&& depth<= 3*/){
                let neighbot = this.getIndex([y,x])
                if(this.board[y][x] === "" && depth === 0){
                    avialbleMoves.push({position:[y,x], color:"green", id:neighbot, parentId: this.getIndex([pose[1],pose[0]])})
                }
                else if(this.board[y][x].toLowerCase() === opponent) {
                    if(depth < 2){
                        avialbleMoves.push({position:[y,x], color:"blue", id:neighbot, parentId: this.getIndex([pose[1],pose[0]])})
                    }
                    const x1 = x +i
                    const y1 = y + direction
                    let neighbotOpennet = this.getIndex([y1,x1])
                    if(this.checkWithinBoundry(x1,y1)){
                        
                        if(this.board[y1][x1] === "")
                        {
                            avialbleMoves.push({position:[y1,x1], color:"red", id:neighbotOpennet, parentId: this.getIndex([y,x])})
                            const nextMove = this.checkNeighbor([x1,y1], direction, opponent, depth + 1)
                            avialbleMoves.push(...nextMove);
                        }
                    }
                }
            }
        }
        return avialbleMoves
    }

    changeListToOrigin(tilesElements){
        for (let i = 0; i < this.blackTiles.length; i++) {
            tilesElements[this.blackTiles[i]].style.backgroundColor = "black"
        }
        this.blackTiles = []
        this.moves = []
    }
    checkSelected(value){
        const tile = this.blackTiles.find((tile)=>{
            return tile === Number(value);
        })
        if(tile) return true;
        else return false;
    }

    displayMovements(tilesElements, moves){
        this.blackTiles = []
        moves.forEach((move)=>{
            tilesElements[move.id].style.backgroundColor=move.color
            this.blackTiles.push(move.id)
            if(move.parentId !== null){
                // tilesElements[move.parentId].style.backgroundColor="blue"
                this.blackTiles.push(move.parentId)
            }
        })
    }
    // source: https://stackoverflow.com/questions/28160993/tree-recursion-how-to-get-the-parent-root-of-the-selected-tree-node
    getPathToRoot(tree, startId) {
        const path = [];
        let currentNode = tree.find(node => node.id === startId);
        while (currentNode) {
            path.push(currentNode); 
            currentNode = tree.find(node => node.id === currentNode.parentId); 
        }
        return path.reverse(); 
    }

    TileReachOpponentDefenseLine(tilesElements, pose, player){
        if(pose[1] === player.opponentLastLine){
            this.board[pose[1]][pose[0]] = player.symbol.toUpperCase()
            let index = this.getIndex([pose[1],pose[0]])
            tilesElements[index].textContent = player.king
        }
    }

    getBoardValue(index){
        let pose = this.getPoseFromIndex(index)
        return this.board[pose[1]][pose[0]]
    }

    moveToNextTile(tilesElements, currentIndex, selectedTile, player){
        let listOfStoneToRemove = []
        let SelectedList = this.getPathToRoot(boardClass.moves, Number(currentIndex))
        // console.log("reorde: ",SelectedList)
        if(SelectedList.length>1 && SelectedList.at(-1).id === Number(currentIndex)){
            for (let i = 0; i < SelectedList.length; i++) {
                if(this.getBoardValue(SelectedList[i].id).toLowerCase() === player.opponent){
                    listOfStoneToRemove.push(SelectedList[i].id)
                }
            }
        }
        // console.log("stone to remove: ", listOfStoneToRemove)
        if(listOfStoneToRemove.length>0 && selectedTile!==null){
            for (let i = 0; i < listOfStoneToRemove.length; i++) {
                const removeTile = listOfStoneToRemove[i];
                tilesElements[removeTile].textContent = "";
                let poseRemove = this.getPoseFromIndex(removeTile);
                this.board[poseRemove[1]][poseRemove[0]] = "";
                player.point += 1;
            }
        }
        let selectedPose = this.getPoseFromIndex(selectedTile);
        if(this.board[selectedPose[1]][selectedPose[0]] === player.symbol.toUpperCase()){
            tilesElements[currentIndex].textContent = player.king;
        }else{
            tilesElements[currentIndex].textContent = player.circle;
        }
        tilesElements[selectedTile].textContent = "";
        let pose = this.getPoseFromIndex(currentIndex);
        
        this.board[pose[1]][pose[0]] = this.board[selectedPose[1]][selectedPose[0]];
        this.board[selectedPose[1]][selectedPose[0]] = "";
        this.TileReachOpponentDefenseLine(tilesElements, pose,player)
        this.changeListToOrigin(tilesElements);
        this.elementStoneOptionsTemp = []
    }

    getListOfMoves(player){
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if(this.board[i][j] === player.symbol){
                    console.log(this.getIndex([i,j]), i,j)
                    let moves = this.checkNeighbor(this.getIndex([i,j]), player.direction,player.opponent)
                    console.log(moves)
                }
            }
            
        }
    }
    
}