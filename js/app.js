
const redCircle = "🔴"
const whiteCircle = "⚪"
const greenCircle = "🟢"
const yellowCircle = "🟡"
const orangeCircle = "🟠"
const boardElement = document.querySelector(".board")
let board = []
//Create the board and tiles
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

function getIDFromPoe(index){
    let x = index % 8 ;
    let y = Math.floor(index / 8 );
    return [x,y]
}

function getBoardValue(index){
    let pose = getIDFromPoe(index)
    return board[pose[1]][pose[0]]
}

function getIndex(pose){
    // console.log(pose)
    let index = pose[1]*8 + pose[0]
    // console.log(`numer is : ${pose[1]*8 + pose[0]}`)
    return index
}
function getNeighbor(index){
    let pose = getIDFromPoe(index)
    if(board[pose[1]][pose[0]] === "r"){
        for(i=-1; i <=1; i+=2){
            let x = pose[0]+i
            let y = pose[1]-1
            if(x> 0 && y >0){
                let neighbot = [x,y]
                if(board[y][x] === ""){
                    let  neighborIndex = getIndex(neighbot)
                    tilesElements[neighborIndex].style.backgroundColor="green"
                    tilesElements[neighborIndex].textContent=`(${x},${y})`
                    board[y][x] = "g"
                    console.log(`neighbotpose is : ${x},${y}`)
                    // console.log(`neighbor index is : ${neighborIndex}`)
                }   
            }
        }
    }
}

tilesElements.forEach((tile)=>{
    tile.addEventListener('click',(event)=>{
        let indexID = event.target.id
        // console.log(indexID)
        let pose = getIDFromPoe(indexID)
        // console.log(`Pose: ${pose}`)
        getNeighbor(indexID)
        // let calculatedIndex = getIndex(pose)
        // console.log(`calculated index: ${calculatedIndex}`)
        // console.log(getBoardValue(indexID))
        console.log(board)
    })
})
