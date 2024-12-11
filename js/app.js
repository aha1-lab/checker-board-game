const redCircle = "🔴"
const redCircleKing = "🟥"
const whiteCircle = "⚪"
const whiteCircleKing = "⬜"

const greenCircle = "🟢"
const yellowCircle = "🟡"
const orangeCircle = "🟠"

let GRID_SIZE = 8;
const player1 = {
    name : 'red',
    circle : redCircle,
    symbol : "r",
    point : 0,
    nextTurnSymbol: "w",
    direction : -1,
    opponentLastLine : 0,
    king : redCircleKing
}

const player2 = {
    name : 'white',
    circle : whiteCircle,
    symbol : "w",
    point : 0,
    nextTurnSymbol: "r",
    direction : 1,
    opponentLastLine : 7,
    king : whiteCircleKing
}

const boardElement = document.querySelector(".board")
const messageElement = document.querySelector('.message')
const results = document.querySelectorAll(".results")
const helpButtonElement = document.querySelector("#help")
const resetButtonElement = document.querySelector("#reset")
let tilesElements = []
let board = []
let originalBoard = []
let selectedTile = false
let blackTiles = []
let playerTurn = 'r'
let elementStoneOptionsTemp = []
let winner = false

const updateMessage = ()=>{
    if(playerTurn === player1.symbol)
        messageElement.textContent = `player turn is: ${player1.name}`;
    else{
        messageElement.textContent = `player turn is: ${player2.name}`;
    }
}

const updateResult = ()=>{
    results[0].textContent = player1.point
    results[1].textContent = player2.point
}
updateMessage()
updateResult()
//------------Create the board and tiles------------------//

function restart(){
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            board[j][i] === originalBoard[j][i]
        }
    }
    selectedTile = false
    blackTiles = []
    playerTurn = 'r'
    elementStoneOptionsTemp = []
    winner = false
    player1.point = 0
    player2.point = 0
    updateMessage()
    updateResult()
}
function createBoard(){
    let tileID = 0
    for (let i = 0; i < GRID_SIZE; i++) {
        let line = []
        let lineOrigin = []
        for (let j = 0; j < GRID_SIZE; j++) {
            let tempTile = document.createElement("div");
            if((i+j)%2 === 0) {
                tempTile.style.backgroundColor = "rgb(255, 221, 9)"
                line.push("")
                lineOrigin.push("")
            }else{
                tempTile.style.backgroundColor = "black"
                if(board.length < 3){
                    // tempTile.textContent = whiteCircle
                    line.push("w")
                    lineOrigin.push("w")
                }
                else if (board.length > 4){
                    // tempTile.textContent = redCircle
                    line.push("r")
                    lineOrigin.push("r")
                }else{
                    line.push("")
                    lineOrigin.push("")
                }
            }
            if(tilesElements.length === 64){
                
            }
            tempTile.className = "tile";
            tempTile.id = tileID;
            boardElement.appendChild(tempTile);
            tileID+=1;
        }
        board.push(line)
        originalBoard.push(lineOrigin)
    }
    tilesElements = document.querySelectorAll(".tile")
}

function addStone(){
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            let tempIndex = getIndex([j,i])
            if(originalBoard[j][i] === player1.symbol){
                tilesElements[tempIndex].textContent = player1.circle
            }else if(originalBoard[j][i] === player2.symbol){
                tilesElements[tempIndex].textContent = player2.circle
            }else{
                tilesElements[tempIndex].textContent = ""
            }
        }
    }
}
createBoard()
addStone()

//--- Helper function to get the list indexs of a certin player ---//
function getListOfIndexs(player){
    let listOfIndex = []
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if(board[i][j] === player.symbol){
                let tempIndex = getIndex([i,j])
                listOfIndex.push(tempIndex)
            }
        }     
    }
    return listOfIndex;
}


function getPoseFromIndex(index){
    let x = index % GRID_SIZE ;
    let y = Math.floor(index / GRID_SIZE );
    return [x,y]
}

function getBoardValue(index){
    let pose = getPoseFromIndex(index)
    return board[pose[1]][pose[0]]
}

function getIndex(pose){
    let index = pose[0]*GRID_SIZE + pose[1]
    return index
}

// source: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value){
    return Object.key(object).find(key=> object[key] === value)
}

function checkWithinBoundry(x,y){
    if(x>=0 && y >=0 && x<=(GRID_SIZE-1) && y <=(GRID_SIZE-1))
        return true
    else {
        return false
    }
}

function checkNeighbor(pose, direction, opponent, depth=0){
    if (depth > 3) return;
    if(depth === 0 ){
        elementStoneOptionsTemp.push({id: getIndex([pose[1],pose[0]]), parentId: null})
    }
    for(i=-1; i <=1; i+=2){
        const x = pose[0]+i
        const y = pose[1]+direction
        if(checkWithinBoundry(x,y) && depth<= 3){
            let neighbot = [y,x]
            if(board[y][x] === "" && depth === 0){
                let neighborIndex = getIndex(neighbot)
                blackTiles.push(neighborIndex)
                tilesElements[neighborIndex].style.backgroundColor="green"
                elementStoneOptionsTemp.push({id: getIndex([y,x]), parentId: getIndex([pose[1],pose[0]])})
            }
            else if(board[y][x].toLowerCase() === opponent) {
                elementStoneOptionsTemp.push({id: getIndex([y,x]), parentId: getIndex([pose[1],pose[0]])})
                const x1 = x +i
                const y1 = y + direction
                if(checkWithinBoundry(x1,y1)){
                    const neighbot = [y1,x1]
                    const neighborIndex1 = getIndex(neighbot)
                    elementStoneOptionsTemp.push({id: neighborIndex1, parentId: getIndex([y,x])})
                    if(board[y1][x1] === "")
                    {
                        tilesElements[neighborIndex1].style.backgroundColor="red"
                        blackTiles.push(neighborIndex1)
                        // this is a recursive
                        depth+=1;
                        checkNeighbor([x1,y1], direction, opponent, depth + 1)
                    }
                }
            }
        }
    }
}

function changeListToOrigin(){
    for (let i = 0; i < blackTiles.length; i++) {
        tilesElements[blackTiles[i]].style.backgroundColor = "black"
    }
    blackTiles = []
}

function getNeighbor(index, player){
    let pose = getPoseFromIndex(index)
    changeListToOrigin()
    if(board[pose[1]][pose[0]] === player.symbol.toUpperCase()){
        checkNeighbor(pose,player.direction, player.nextTurnSymbol)
        checkNeighbor(pose,player.direction * -1, player.nextTurnSymbol)
    }else{
        checkNeighbor(pose,player.direction, player.nextTurnSymbol)
    }
}

function checkSelected(value){
    const tile = blackTiles.find((tile)=>{
        return tile === Number(value);
    })
    if(tile) return true;
    else return false;
}

// source: https://stackoverflow.com/questions/28160993/tree-recursion-how-to-get-the-parent-root-of-the-selected-tree-node
function getPathToRoot(tree, startId) {
    const path = [];
    let currentNode = tree.find(node => node.id === startId);
    while (currentNode) {
        path.push(currentNode); 
        currentNode = tree.find(node => node.id === currentNode.parentId); 
    }
    return path.reverse(); 
}

function moveToNextTile(currentIndex, player){
    let listOfStoneToRemove = []
    let listOfStoneToRemove2 = getPathToRoot(elementStoneOptionsTemp, Number(currentIndex))
    if(listOfStoneToRemove2.length>1 && listOfStoneToRemove2.at(-1).id === Number(currentIndex)){
        for (let i = 0; i < listOfStoneToRemove2.length; i++) {
            if(getBoardValue(listOfStoneToRemove2[i].id).toLowerCase() === player.nextTurnSymbol){
                listOfStoneToRemove.push(listOfStoneToRemove2[i].id)
            }
        }
    }
    if(listOfStoneToRemove.length>0){
        for (let i = 0; i < listOfStoneToRemove.length; i++) {
            const removeTile = listOfStoneToRemove[i];
            tilesElements[removeTile].textContent = "";
            let poseRemove = getPoseFromIndex(removeTile);
            board[poseRemove[1]][poseRemove[0]] = "";
            player.point += 1;
        }
    }
    let selectedPose = getPoseFromIndex(selectedTile);
    if(board[selectedPose[1]][selectedPose[0]] === player.symbol.toUpperCase()){
        tilesElements[currentIndex].textContent = player.king;
    }else{
        tilesElements[currentIndex].textContent = player.circle;
    }
    tilesElements[selectedTile].textContent = "";
    let pose = getPoseFromIndex(currentIndex);
    
    board[pose[1]][pose[0]] = board[selectedPose[1]][selectedPose[0]];
    board[selectedPose[1]][selectedPose[0]] = "";
    TileReachOpponent(pose,player)
    changeListToOrigin();
    elementStoneOptionsTemp = []
}

function TileReachOpponent(pose, player){
    if(pose[1] === player.opponentLastLine){
        board[pose[1]][pose[0]] = player.symbol.toUpperCase()
        let index = getIndex([pose[1],pose[0]])
        tilesElements[index].textContent = player.king
    }
}

function checkWinner(){
    if(player1.point === 12){
        return player1.symbol
    }else if(player2.point === 12){
         return player2.symbol
    }else{
        return false
    }
}

function play(indexID, pose, player){
    console.log(board[pose[1]][pose[0]])
    if (checkSelected(indexID) && selectedTile && blackTiles.length > 0){
        moveToNextTile(indexID, player)
        playerTurn = player.nextTurnSymbol
    }else if (board[pose[1]][pose[0]].toLowerCase() === player.symbol){
        getNeighbor(indexID, player)
        if(blackTiles.length === 0){
            console.log("There is no space to move")
        }
    }else{
        console.log("Select stone or go to valid choise")
        changeListToOrigin()
        selectedTile = null
    }
    selectedTile = indexID;
}

tilesElements.forEach((tile)=>{
    tile.addEventListener('click',(event)=>{
        let indexID = event.target.id
        console.log(`Pressed tile infor: ${(indexID)}`)
        let pose = getPoseFromIndex(indexID)
        let poseSelected = getPoseFromIndex(selectedTile)
        // Check if both conditions 
        if( playerTurn === player1.symbol && winner === false){
            play(indexID, pose, player1)
            
        }else if(playerTurn === player2.symbol && winner === false){
            play(indexID, pose, player2)
        }else{
            changeListToOrigin()
            selectedTile = null
        }
        updateMessage()
        updateResult()
        winner = checkWinner();
        if(winner){
            messageElement.textContent = `The winner is ${winner}`
        }
        console.log(board)
        console.log(originalBoard)
    })
})



function checkAllMoves(player) {
    elementStoneOptionsTemp = [];
    blackTiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (board[y][x].toLowerCase() === player.symbol) {
                checkNeighbor([x, y], 1, player.nextTurnSymbol); // Forward direction
                checkNeighbor([x, y], -1, player.nextTurnSymbol); // Backward direction
            }
        }
    }
}

helpButtonElement.addEventListener('click', (event)=>{
    if(playerTurn === 'r'){
        checkAllMoves(player1)
    }else{
        checkAllMoves(player2)
    }
})

resetButtonElement.addEventListener('click',(event)=>{
    location.reload(true);
})