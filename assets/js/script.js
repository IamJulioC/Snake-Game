const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const score = document.querySelector('.score-value');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play')
const finalScore = document.querySelector('.final-score > span');
const audio = new Audio('./assets/audio/somCobrinha.mp3');

const size = 30
const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
};

const randomNumber = (min, max) => {

    return Math.round(Math.random() * (max - min) + min)
};

const randomPosition = () => {

    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
};

const randomColor = () => {

    const r = randomNumber(0, 255)
    const g = randomNumber(0, 255)
    const b = randomNumber(0, 255)

    return `rgb(${r}, ${g}, ${b})`
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

let direction, loopId 

const drawFood = () =>{

    const {x, y, color} = food

    context.shadowColor = color
    context.shadowblur = 15
    context.fillStyle = color
    context.fillRect(x, y, size, size)
    context.shadowColor = 0
};

const drawSnake = () =>{

    context.fillStyle = '#03624c'
    
    snake.forEach((position, index) => {

        if(index == snake.length -1) {
            context.fillStyle = '#00df81'
        }

        context.fillRect(position.x, position.y, size, size)
    })
};

const moveSnake = () => {

    if(!direction) return

    const head = snake[snake.length -1]


    if(direction == 'right'){
        snake.push({x:head.x + size, y:head.y})
    }

    if(direction == 'left'){
        snake.push({x:head.x - size, y:head.y})
    }

    if(direction == 'down'){
        snake.push({x:head.x, y:head.y + size})
    }

    if(direction == 'up'){
        snake.push({x:head.x , y:head.y - size})
    }

    snake.shift()
};

const drawGrid = () =>{

    context.lineWidth = 1
    context.strokeStyle = '#032221'
    
    for (let i = 30; i < canvas.width; i+=30) {
        context.beginPath()
        context.lineTo(i, 0)
        context.lineTo(i, 600)
        context.stroke()

        context.beginPath()
        context.lineTo(0, i)
        context.lineTo(600, i)
        context.stroke()
    }
};

const checkEat = () =>{

    const head = snake[snake.length -1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)
        audio.play()
        incrementScore()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
};

const checkCollision = () =>{

    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    }) 

    if(wallColision || selfColision){
        gameOver()
    }
};

const gameOver = () =>{
    direction = undefined

    menu.style.display = 'flex'
    finalScore.innerText = score.innerText

    canvas.style.filter = 'blur(8px)'
    
};

const gameLoop = () =>{

    clearInterval(loopId)

    context.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() =>{
        gameLoop()
    },300)
};

gameLoop()

document.addEventListener('keydown', (event) =>{

    if(event.key == 'ArrowRight' && direction != 'left'){
        direction = 'right'
    }

    if(event.key == 'ArrowLeft' && direction != 'right'){
        direction = 'left'
    }

    if(event.key == 'ArrowDown' && direction != 'up'){
        direction = 'down'
    }

    if(event.key == 'ArrowUp' && direction != 'down'){
        direction = 'up'
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
