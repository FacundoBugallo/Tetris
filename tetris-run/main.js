import './style.css';
//1. inisilisamos el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20;
const BLOCK_WIDTH = 14;
const BLOCK_HEIGHT = 30;

canvas.width = BLOCK_SIZE * BLOCK_WIDTH;
canvas.height = BLOCK_SIZE * BLOCK_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

//board

const board = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,1,1,1,1,1,1,1,1]
]


//piece

const piece = {
  position: {x: 1, y: 1},
  shape: [
    [1,1],//coma
    [1,1]
  ]
}

const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1 , 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]

]



//game loop
function draw (){
  context.fillStyle = '#111'
  context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value === 1) {
        context.fillStyle = 'blue'
        context.fillRect(x ,y ,1 ,1 )
        }
      })
    })
  piece.shape.forEach((row,y) => {
    row.forEach((value,x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y,1 , 1)
      } 
    })
  })
}

//drops
//game loop
let dropCounter = 0
let lastTime = 0

function update (time = 0){
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 500) {
    piece.position.y++
    dropCounter = 0

    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

//KeysValue 

document.addEventListener ('keydown', evt => {  
  if (evt.key === 'ArrowLeft'){
    piece.position.x--
    if(checkCollision()){
      piece.position.x++
      console.log("dete")
    }
  } 
  if (evt.key === 'ArrowRight'){
    piece.position.x++
    if(checkCollision()){
      piece.position.x--
    }
  }
  if (evt.key === 'ArrowDown'){
    piece.position.y++
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
})


// Logics

function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && 
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
};

function solidifyPiece (){
  piece.shape.forEach((row, x) => {
    row.forEach((value, y) => {
      if (value === 1){
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })   
  })

  //get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  piece.position.x = 0
  piece.position.y = 0
}

function removeRows () {
  const rowsToRemover = []

  board.forEach((row, y) => {
    if (row.every(value => value === 1 )) {
      rowsToRemover.push(y)
    }
  })

  rowsToRemover.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BLOCK_WIDTH).fill(0)
    board.unshift(newRow)
  })
}

update();

 