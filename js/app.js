//--------------------------------------------------//
class Node{
    constructor(data){
        this.data = data;
        this.children = []
    }

    add(data){
        this.children.play(new Node(data));
    }

    remove(data){
        this.children = this.children.filter((node)=>{
            return node.data !== data;
        })
    }
}






//--------------------------------------------------//
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
let board = []
let selectedTile = false
let blackTiles = []
let playerTurn = 'r'
let elementStoneOptions = {}
let elementStoneOptionsTemp = []

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
for (let i = 0; i < GRID_SIZE; i++) {
    let line = []
    for (let j = 0; j < GRID_SIZE; j++) {
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


function checkNeighbor(pose, direction, opponent, depth=0){
    if(depth === 0 ){
        elementStoneOptionsTemp.push({id: getIndex([pose[1],pose[0]]), parentId: null})
    }
    for(i=-1; i <=1; i+=2){
        let x = pose[0]+i
        let y = pose[1]+direction
        console.log("Here ", getIndex([pose[1],pose[0]]))
        if(x>=0 && y >=0 && x<=7 && y <=7 && depth<= 3){
            let neighbot = [y,x]
            if(board[y][x] === "" && depth === 0){
                let neighborIndex = getIndex(neighbot)
                blackTiles.push(neighborIndex)
                tilesElements[neighborIndex].style.backgroundColor="green"
                elementStoneOptionsTemp.push({id: getIndex([y,x]), parentId: getIndex([pose[1],pose[0]])})
            }
            else if(board[y][x].toLowerCase() === opponent) {
                elementStoneOptionsTemp.push({id: getIndex([y,x]), parentId: getIndex([pose[1],pose[0]])})
                let x1 = x +i
                let y1 = y + direction
                if(x1>=0 && y1>=0 && x1<=7 && y1<=7){
                    let neighbot = [y1,x1]
                    let neighborIndex1 = getIndex(neighbot)
                    console.log(y1,x1)
                    console.log("AAAAAA",neighborIndex1)
                    elementStoneOptionsTemp.push({id: neighborIndex1, parentId: getIndex([y,x])})
                    if(board[y1][x1] === "")
                    {
                        tilesElements[neighborIndex1].style.backgroundColor="red"
                        blackTiles.push(neighborIndex1)
                        elementStoneOptions[neighborIndex1] = getIndex([y,x])
                        // elementStoneOptionsTemp.push({id: neighborIndex1, parentId: getIndex([y,x])})
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
    // console.log(board[pose[1]][pose[0]])
    if(board[pose[1]][pose[0]] === player.symbol.toUpperCase()){
        // console.log("Move King")
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

function checkIndexInList(index){
    let output = elementStoneOptionsTemp.find((element)=>{
        return element.id === index
    })
    console.log("OUTPUT: ",output)
    return output
}



/*
{id: 3, parentId: null}
{id: 3, parentId: null}
{id: 10, parentId: 3}
{id: 12, parentId: 3}
{id: 21, parentId: 12}
{id: 30, parentId: 21}
{id: 39, parentId: 30}
*/

function getPathToRoot(tree, startId) {
    const path = [];
    let currentNode = tree.find(node => node.id === startId);
    console.log("Inside", currentNode)
    while (currentNode) {
        path.push(currentNode); // Add the current node to the path
        currentNode = tree.find(node => node.id === currentNode.parentId); // Find the parent node
    }

    return path.reverse(); // Reverse the path to go from root to the starting node
}

function moveToNextTile(currentIndex, player){
    let listOfStoneToRemove = []
    let listOfStoneToRemove2 = getPathToRoot(elementStoneOptionsTemp, Number(currentIndex))
    if(listOfStoneToRemove2.length>1 && listOfStoneToRemove2.at(-1).id === Number(currentIndex)){
        for (let i = 0; i < listOfStoneToRemove2.length; i++) {
            console.log("ID", getBoardValue(listOfStoneToRemove2[i].id))
            if(getBoardValue(listOfStoneToRemove2[i].id).toLowerCase() === player.nextTurnSymbol){
                listOfStoneToRemove.push(listOfStoneToRemove2[i].id)
            }
        }
    }
    
    if(listOfStoneToRemove.length>0){
        for (let i = 0; i < listOfStoneToRemove.length; i++) {
            const removeTile = listOfStoneToRemove[i];
            delete elementStoneOptions[currentIndex];
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
function play(indexID, pose, player){
    console.log(board[pose[1]][pose[0]])
    if (checkSelected(indexID) && selectedTile && blackTiles.length > 0){
        moveToNextTile(indexID, player)
        playerTurn = player.nextTurnSymbol
    }else if (board[pose[1]][pose[0]].toLowerCase() === player.symbol){
        getNeighbor(indexID, player)
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
        if( playerTurn === player1.symbol){
           play(indexID, pose, player1)
           
        }else if(playerTurn === player2.symbol){
            play(indexID, pose, player2)
        }else{
            changeListToOrigin()
            selectedTile = null
        }
        
        updateMessage()
        updateResult()
        console.log(board)
    })
})
