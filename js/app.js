const boardElement = document.querySelector(".board")
const messageElement = document.querySelector('.message')
const results = document.querySelectorAll(".results")
const helpButtonElement = document.querySelector("#help")
const resetButtonElement = document.querySelector("#reset")
const winningBannerElement = document.querySelector(".winning-banner")
const player1ColorsElements = document.querySelector(".color-1")
const player2ColorsElements = document.querySelector(".color-2")
const gameModeElement = document.querySelector(".game-mode")

let tilesElements = []
let selectedTile = false
let playerTurn = 'r'
let winner = false
let gameMode = 0 // 1: for PC game and 2: for two player
const colors={
    red:    {circle : "🔴", king : "🟥"},
    white:  {circle : "⚪", king : "⬜"},
    green:  {circle : "🟢", king : "🟩"},
    yellow: {circle : "🟡", king : "🟨"},
    orenge: {circle : "🟠", king : "🟧"}
}
const player1 = {
    name : 'red',
    circle : colors.red.circle,
    symbol : "r",
    point : 0,
    opponent: "w",
    direction : -1,
    opponentLastLine : 0,
    king : colors.red.king,
}

const player2 = {
    name : 'white',
    circle : colors.white.circle,
    symbol : "w",
    point : 0,
    opponent: "r",
    direction : 1,
    opponentLastLine : 7,
    king : colors.white.king
}

//------------Create the board and tiles------------------//
const boardClass = new Board(8)
tilesElements = boardClass.createBoard(tilesElements)
boardClass.addStones(tilesElements,player1,player2)


// source : https://dev.to/rajatamil/dynamic-html-select-drop-down-list-using-javascript-4d72
const updatedDropDownColor = (dropdownElement)=>{
    for (const [key, value] of Object.entries(colors)) {
        let option = document.createElement("option");
        option.value = key
        option.text = value.circle
        dropdownElement.appendChild(option);
    }
}

updatedDropDownColor(player1ColorsElements)
updatedDropDownColor(player2ColorsElements)


const selectColor = (colorList, player)=>{
    colorList.addEventListener('change', (event)=>{
        const selectedValue = event.target.value
        player.circle = colors[selectedValue].circle
        player.king = colors[selectedValue].king
        boardClass.addStones(tilesElements,player1,player2)
    })
}

selectColor(player1ColorsElements,player1)
selectColor(player2ColorsElements,player2)

gameModeElement.addEventListener('change',(event)=>{
    gameMode = Number(event.target.value)
    // console.log(gameMode)
})

const updateMessage = ()=>{
    if(playerTurn === player1.symbol)
        messageElement.textContent = `player turn is: Player 1`;
    else{
        messageElement.textContent = `player turn is: Player 2`;
    }
}

const updateResult = ()=>{
    results[0].textContent = player1.point
    results[1].textContent = player2.point
}
updateMessage()
updateResult()




//--- Helper function to get the list indexs of a certin player ---//
function getNeighbor(index, player){
    console.log(index)
    let pose = boardClass.getPoseFromIndex(index)
    boardClass.changeListToOrigin(tilesElements)
    if(boardClass.board[pose[1]][pose[0]] === player.symbol.toUpperCase()){
        const movesFront = boardClass.checkNeighbor(pose,player.direction, player.opponent)
        const moveBack = boardClass.checkNeighbor(pose,player.direction * -1, player.opponent)
        boardClass.moves.push(...movesFront, ...moveBack)
    }else{
        boardClass.moves.push(...boardClass.checkNeighbor(pose,player.direction, player.opponent))
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

function delay(seconds, callback) {
    setTimeout(callback, seconds * 1000);
}

function PCPlayer(){
    updateMessage()
    let movesList = boardClass.getListOfMoves(player2)
    const filteredMovesList = movesList.filter((list)=>{
        return list.moves.every((move)=>{
            return move.stone !== true
        })
    })
    // console.log(movesList)
    // console.log(filteredMovesList)

    if(movesList.length > 0){
        let randomStone = boardClass.getRandomStone(movesList)
        let randomMoveForStone = boardClass.getRandomMove(randomStone)
        console.log("Random stone:", randomStone.id, randomStone.moves)
        boardClass.moves = randomStone.moves
        boardClass.displayMovements(tilesElements, boardClass.moves)
        delay(2, () => {
            boardClass.moveToNextTile(tilesElements,randomMoveForStone.id, randomStone.id , player2)
            updateResult()
        });
        playerTurn = player2.opponent
    }else{
        winner = checkWinner();
        if(winner){
            const winConentElement = document.querySelector("#win-content")
            let winnerName = player1.symbol === winner ? "player 1" : "player 2"
            messageElement.textContent = `The winner is ${winnerName}`
            winningBannerElement.style.display= 'block'
            winConentElement.textContent = `The winner is ${winnerName}`
        }
    }
}


function play(indexID, pose, player){
    // if the tile selected and a new tile selected present in the blackList
    // we will go to the new position
    if (boardClass.checkSelected(indexID) && selectedTile && boardClass.blackTiles.length > 0
        && boardClass.board[pose[1]][pose[0]].toLowerCase() !== player.opponent
        && boardClass.board[pose[1]][pose[0]].toLowerCase() !== player.symbol){
        boardClass.moveToNextTile(tilesElements, indexID, selectedTile, player)
        playerTurn = player.opponent
        if(gameMode === 1){
            PCPlayer()
        }
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
    updateMessage()
    updateResult()
    winner = checkWinner();
    if(winner){
        const winConentElement = document.querySelector("#win-content")
        let winnerName = player1.symbol === winner ? "player 1" : "player 2"
        messageElement.textContent = `The winner is ${winnerName}`
        winningBannerElement.style.display= 'block'
        winConentElement.textContent = `The winner is ${winnerName}`
    }
}

tilesElements.forEach((tile)=>{
    tile.addEventListener('click',(event)=>{
        if(gameMode !== 0){
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
            // console.log(board)
        }else{
            console.log("please select game mode")
        }
        
    })
})


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