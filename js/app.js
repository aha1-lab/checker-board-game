
const redCircle = "🔴"
const whiteCircle = "⚪"
const greenCircle = "🟢"
const yellowCircle = "🟡"
const orangeCircle = "🟠"

const player1 = {
    name : 'red',
    circle : redCircle,
    symbol : "r",
    point : 0,
    nextTurnSymbol: "w",
    direction : -1
}

const player2 = {
    name : 'white',
    circle : whiteCircle,
    symbol : "w",
    point : 0,
    nextTurnSymbol: "r",
    direction : 1
}

const boardElement = document.querySelector(".board")
const messageElement = document.querySelector('.message')
const results = document.querySelectorAll(".results")
let board = []
let selectedTile = false
let blackTiles = []
let playerTurn = 'r'
let elementStoneOptions = {}

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
let tileID = 0
for (let i = 0; i < 8; i++) {
    let line = []
    for (let j = 0; j < 8; j++) {
        let tempTile = document.createElement("div");
        if((i+j)%2 === 0) {
            tempTile.style.backgroundColor = "white"
            line.push("")
        }else{
            tempTile.style.backgroundColor = "black"
            if(board.length < 3){
                tempTile.textContent = whiteCircle
                line.push("w")
            }
            else if (board.length > 4){
                tempTile.textContent = redCircle
                line.push("r")
            }else{
                line.push("")
            }
        }
        tempTile.className = "tile";
        tempTile.id = tileID;
        boardElement.appendChild(tempTile);
        tileID+=1;
    }
    board.push(line)
}



let tilesElements = document.querySelectorAll(".tile")
// console.log(board);
board[0][3] = ''
board[1][2] = 'r'
tilesElements[getIndex([0,3])].textContent = ""
tilesElements[getIndex([1,2])].textContent = redCircle

board[7][2] = ''
board[6][1] = 'w'
tilesElements[getIndex([7,2])].textContent = ""
tilesElements[getIndex([6,1])].textContent = whiteCircle

function getPoseFromIndex(index){
    let x = index % 8 ;
    let y = Math.floor(index / 8 );
    return [x,y]
}

function getBoardValue(index){
    let pose = getPoseFromIndex(index)
    return board[pose[1]][pose[0]]
}

function getIndex(pose){
    let index = pose[0]*8 + pose[1]
    return index
}

// source: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value){
    return Object.key(object).find(key=> object[key] === value)
}
function checkNeighbor(pose, direction, opponent){
    for(i=-1; i <=1; i+=2){
        let x = pose[0]+i
        let y = pose[1]+direction
        if(x>=0 && y >=0 && x<=7 && y <=7){
            let neighbot = [y,x]
            // console.log(`Pose: ${neighbot}`)
            if(board[y][x] === ""){
                let neighborIndex = getIndex(neighbot)
                blackTiles.push(neighborIndex)
                tilesElements[neighborIndex].style.backgroundColor="green"
            }
            else if(board[y][x] === opponent) {
                // continue
                let x1 = x +i
                let y1 = y + direction
                if(x1>=0 && y1>=0 && x1<=7 && y1<=7){
                    let neighbot = [y1,x1]
                    let neighborIndex1 = getIndex(neighbot)
                    console.log(y1,x1)
                    if(board[y1][x1] === "")
                    {
                        tilesElements[neighborIndex1].style.backgroundColor="red"
                        blackTiles.push(neighborIndex1)
                        elementStoneOptions[neighborIndex1] = getIndex([y,x])
                        console.log(elementStoneOptions)
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
    checkNeighbor(pose,player.direction, player.nextTurnSymbol)
}

function checkSelected(value){
    const tile = blackTiles.find((tile)=>{
        return tile === Number(value);
    })
    if(tile) return true;
    else return false;
}

function moveToNextTile(currentIndex, player){
    // console.log(currentIndex)
    // console.log(`Remove this tile: ${elementStoneOptions[currentIndex]}`)
    // console.log(`Key: ${key}`)
    let key = Object.keys(elementStoneOptions)
    if(Number(key) === Number(currentIndex)){
        let removeTile = elementStoneOptions[currentIndex]
        tilesElements[removeTile].textContent = "";
        let poseRemove = getPoseFromIndex(removeTile)
        console.log(board[poseRemove[1]][poseRemove[0]])
        board[poseRemove[1]][poseRemove[0]] = ""
        player.point += 1;
        elementStoneOptions = {}
        console.log("Remove stone")
    }
    tilesElements[currentIndex].textContent = player.circle;
    tilesElements[selectedTile].textContent = "";
    let pose = getPoseFromIndex(currentIndex)
    board[pose[1]][pose[0]] = player.symbol
    pose = getPoseFromIndex(selectedTile)
    board[pose[1]][pose[0]] = ""
    changeListToOrigin()
}


function play(indexID, pose, player){
    if (checkSelected(indexID) && selectedTile && blackTiles.length > 0){
        // console.log("Move")
        moveToNextTile(indexID, player)
        playerTurn = player.nextTurnSymbol
    }else if (board[pose[1]][pose[0]] === player.symbol){
        getNeighbor(indexID, player)
    }else{
        console.log("Select stone or go to valid choise")
        changeListToOrigin()
    }
    selectedTile = indexID;
}
tilesElements.forEach((tile)=>{
    tile.addEventListener('click',(event)=>{
        let indexID = event.target.id
        // console.log(`Pressed tile infor: ${getBoardValue(indexID)}`)
        let pose = getPoseFromIndex(indexID)
        let poseSelected = getPoseFromIndex(selectedTile)
        // Check if both conditions 
        if( playerTurn === player1.symbol){
           play(indexID, pose, player1)
        }else if(playerTurn === player2.symbol){
            play(indexID, pose, player2)
        }else{
            changeListToOrigin()
        }
        updateMessage()
        updateResult()
        // console.log(board)
    })
})
