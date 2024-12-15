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
let selectedTile = false
let playerTurn = 'r'
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
const boardClass = new Board(8)
tilesElements = boardClass.createBoard(tilesElements)
boardClass.addStones(tilesElements,player1,player2)


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

function getNeighbor(index, player){
    let pose = boardClass.getPoseFromIndex(index)
    boardClass.changeListToOrigin(tilesElements)
    if(boardClass.board[pose[1]][pose[0]] === player.symbol.toUpperCase()){
        const movesFront = boardClass.checkNeighbor(pose,player.direction, player.nextTurnSymbol)
        const moveBack = boardClass.checkNeighbor(pose,player.direction * -1, player.nextTurnSymbol)
        boardClass.moves.push(...movesFront, ...moveBack)
    }else{
        boardClass.moves.push(...boardClass.checkNeighbor(pose,player.direction, player.nextTurnSymbol))
    }
    boardClass.displayMovements(tilesElements, boardClass.moves)
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
    // if the tile selected and a new tile selected present in the blackList
    // we will go to the new position
    if (boardClass.checkSelected(indexID) && selectedTile && boardClass.blackTiles.length > 0
        && boardClass.board[pose[1]][pose[0]].toLowerCase() !== player.nextTurnSymbol){
        boardClass.moveToNextTile(tilesElements, indexID, selectedTile, player)
        playerTurn = player.nextTurnSymbol
    }
    // here I will select the stones on the tiles and check if the stone belong 
    // to the player turn
    else if (boardClass.board[pose[1]][pose[0]].toLowerCase() === player.symbol){ 
        getNeighbor(indexID, player)
        if(boardClass.blackTiles.length === 0){
            console.log("There is no space to move")
        }
    }else{
        console.log("Select stone or go to valid choise")
        boardClass.changeListToOrigin(tilesElements)
        selectedTile = null
    }
    selectedTile = indexID;
}

tilesElements.forEach((tile)=>{
    tile.addEventListener('click',(event)=>{
        let indexID = event.target.id
        let pose = boardClass.getPoseFromIndex(indexID)
        console.log(`Pressed tile infor: ${(indexID)} and Pose: ${pose}`)
        // Check if both conditions 
        if( playerTurn === player1.symbol && winner === false){
            play(indexID, pose, player1)
            
        }else if(playerTurn === player2.symbol && winner === false){
            play(indexID, pose, player2)
        }else{
            boardClass.changeListToOrigin(tilesElements)
            selectedTile = null
        }
        updateMessage()
        updateResult()
        winner = checkWinner();
        if(winner){
            messageElement.textContent = `The winner is ${winner}`
        }
        // console.log(board)
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
    selectedTile = null;
})

resetButtonElement.addEventListener('click',(event)=>{
    location.reload(true);
})