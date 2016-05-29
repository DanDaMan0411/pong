function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

//////////////////////////////////
//Event Listener For the Buttons//
//////////////////////////////////
upButtonPressed = false
downButtonPressed = false

upButton = document.getElementById("upButton")
downButton = document.getElementById("downButton")

//Mouseup and mousedown are for computer clicks
//Touchstart and touchend are for mobile touch

upButton.addEventListener("mousedown", function(event){
	upButtonPressed = true
})

upButton.addEventListener("mouseup", function(event){
	upButtonPressed = false
})

upButton.addEventListener("touchstart", function(event){
	upButtonPressed = true
})

upButton.addEventListener("touchend", function(event){
	upButtonPressed = false
})

downButton.addEventListener("mousedown", function(event){
	downButtonPressed = true
})

downButton.addEventListener("mouseup", function(event){
	downButtonPressed = false
})

downButton.addEventListener("touchstart", function(event){
	downButtonPressed = true
})

downButton.addEventListener("touchend", function(event){
	downButtonPressed = false
})

///////////////////////////////////////////////
//THIS IS THE EVENT LISTENER TO GET KEY INPUT//
//////////////////////////////////////////////
keysDown = {}

window.addEventListener("keydown", function(event){
	keysDown[event.keyCode] = true
})

window.addEventListener("keyup", function(event){
	delete keysDown[event.keyCode]
})
////////////////////////////////////////////////

var Paddle = function(x, y, width, height, vy){
	this.x = x
	this.y = y
	this.w = width
	this.h = height
	this.vy = vy
	this.score = 0
	
	this.makePaddle = function(ctx){
		ctx.beginPath()
		
		ctx.fillRect(this.x, this.y, this.w, this.h)
		
		ctx.lineWidth = 4
		ctx.strokeRect(this.x + 2, this.y + 2, this.w - 4, this.h- 4)
		//ctx.stroke()
		//ctx.fill()
		ctx.lineWidth = 1
	}
	
	this.update = function(){
		if (upButtonPressed){
			if (this.y > 0){
				this.y -= 10
			}
		}else if (downButtonPressed){
			if (this.y + this.h < canvasHeight){
				this.y += 10
			}
		}
		for(var key in keysDown){
			//if Up arrow pressed
			if (Number(key) == 38){
				if (this.y > 0){
					this.y -= 10
				}
			//if Down arrow pressed
			}else if(Number(key) == 40){
				if (this.y + this.h < canvasHeight){
					this.y += 10
				}
			}
		}
	}
	
}	

var Ball = function(x, y, r, player, computer){
	this.r = r
	this.x = x
	this.y = y
	this.vx = 7
	this.vy = 7
	
	this.restartBall = function(){
		clockTime = 0
		CPUTime = getRandomInt(10, 50)
		this.vx *= -1
		this.x = canvasWidth/2 + this.r
		this.y = getRandomInt(30, canvasHeight - 30)
	}
	
	this.update = function(){
		//this is if the ball hits the right side
		if (this.x > canvasWidth - this.r){
			player.score += 1
			this.restartBall()
			
		//Hit the left side
		}else if(this.x < 0 + this.r){
			computer.score += 1
			this.restartBall()
			
		//this is if it hits top or bottom side
		}else if (this.y + this.r > canvasHeight || this.y < 0 + this.r){
			this.vy *= -1
			if (this.y + this.r > canvasHeight){
				this.y -= (this.y + this.r - canvasHeight) 
			}else if (0 + this.r > this.y){
				this.y += (0 + this.r - this.y)
			}
			
		}		
		this.y += this.vy
		this.x += this.vx
	}
	
	this.draw = function(ctx){
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
		ctx.stroke()
		ctx.fillStlye = "red"
		ctx.fill()
	}
}

var game = function(){
	
	//This initializes stuff
	var c = document.getElementById("game")
	var ctx = c.getContext("2d")
	
	//Makes the canvas the whole page
	maxHeight = 600
	maxWidth = 800
	c.width = window.innerWidth
	if (c.width > maxWidth){
		c.width = maxWidth
	}
	
	if (c.width/1.5 < maxHeight){
		c.height = c.width/1.5
	}else{
		c.height = maxHeight
	}
	canvasWidth = c.width
	canvasHeight = c.height
	
	startX = canvasWidth/2
	startY = getRandomInt(30, canvasHeight - 30)
	
	clockTime = 0
	score = 0
	
	//Prevents the text from being erased when ball hits it
	this.keepText = function(){
		ctx.font = "40px Arial"

		ctx.clearRect((canvasWidth/2 - ctx.measureText(this.score).width/2), 10 , ctx.measureText(this.playerPaddle.score).width, 40 + ctx.lineWidth)
		ctx.clearRect((canvasWidth/2 + ctx.measureText(this.score).width/2), 10 , ctx.measureText(this.computerPaddle.score).width, 40 + ctx.lineWidth)
		
		//This displays the scores
		ctx.fillStyle = "#ee4035"
		ctx.fillText(this.playerPaddle.score, (canvasWidth/2 - ctx.measureText(this.score).width/2), 50)
		ctx.fillText(this.computerPaddle.score, (canvasWidth/2 + ctx.measureText(this.score).width/2), 50)
		
		ctx.fillStyle = "black"
		ctx.strokeText(this.playerPaddle.score, (canvasWidth/2 - ctx.measureText(this.score).width/2), 50)
		ctx.strokeText(this.computerPaddle.score, (canvasWidth/2 + ctx.measureText(this.score).width/2), 50)
		
		//This makes the middle line
		ctx.fillRect(canvasWidth/2 + 5, 0, 10, canvasHeight)
	}
	
	//Makes the paddles and the ball
	this.playerPaddle = new Paddle(10, Math.round(canvasHeight/2 - 50), 50, 100, 10)
	this.computerPaddle = new Paddle(canvasWidth - 10 - 50, Math.round(window.innerHeight/2 - 50), 50, 100, 10)
	this.ball = new Ball(startX - 20, startY, 10, this.playerPaddle, this.computerPaddle)	
	
	winScore = 5
	winnerText = ""
	
	this.writeWinText = function(){
		ctx.lineWidth = 10
		ctx.fillStyle = "#ee4035"
		ctx.strokeRect((canvasWidth/2 - ctx.measureText(winnerText).width/2) - 40, canvasHeight/2 - 40*1.5, ctx.measureText(winnerText).width + 40*2, 40*1.5)
		ctx.fillRect((canvasWidth/2 - ctx.measureText(winnerText).width/2) - 40, canvasHeight/2 - 40*1.5, ctx.measureText(winnerText).width + 40*2, 40*1.5)
		
		ctx.lineWidth = 3
		ctx.fillStyle = "white"
		ctx.strokeText(winnerText, (canvasWidth/2 - ctx.measureText(winnerText).width/2), canvasHeight/2 - 40/2)
		ctx.fillText(winnerText, (canvasWidth/2 - ctx.measureText(winnerText).width/2), canvasHeight/2 - 40/2)
		
		ctx.fillStyle = "black"
		ctx.lineWidth = 0
	}
	
	this.endGame = function(){
		if (this.computerPaddle.score == winScore){
			winnerText = "CPU Won"
			clearInterval(loop)
			this.clearBall()
			this.keepText()
			this.writeWinText()
			
		}else if (this.playerPaddle.score == winScore){
			winnerText = "You Won"
			clearInterval(loop)
			this.clearBall()
			this.keepText()
			this.writeWinText()
		}
		
	}
	
	
	//This clears only the ball, DO NOT CHANGE LINE WIDTH IT MIGHT BREAK THIS
	this.clearBall = function(){
		ctx.clearRect(this.ball.x - this.ball.r - 1, this.ball.y - this.ball.r - 1, this.ball.r * 2 + 2, this.ball.r * 2 + 2)
	}
	
	this.clearTopPaddle = function(){
		//This clears above the paddle
		ctx.clearRect(this.ball.x - this.ball.r - 1, this.ball.y - this.ball.r - 1,this.playerPaddle.w ,this.ball.y - this.playerPaddle.y)
	}
	
	this.clearBottomPaddle = function(){
		//This clears below the rectangle
		ctx.clearRect(this.playerPaddle.x, this.playerPaddle.y + this.playerPaddle.h, this.playerPaddle.w, this.ball.r*2)
	}
	
	this.clearBallPaddleHit = function(){
		//This clears in front of paddle
		ctx.clearRect(this.playerPaddle.x + this.playerPaddle.w, this.playerPaddle.y, this.ball.r*2 ,this.playerPaddle.h)
	
		//This clears behind paddle
		ctx.clearRect(0, 0, 10, canvasHeight)
	}
	
	//Amount of seconds the CPU will follow this pattern
	CPUTime = getRandomInt(10, 50)
	this.moveComputerPaddle = function(){
		if (clockTime < CPUTime){
			this.computerPaddle.y = this.ball.y - this.computerPaddle.h/2
		}else{
			this.computerPaddle.y = this.ball.y + getRandomInt(20, 25)
			
		}
	}
	
	this.hitPaddle = function(){
		//this is if the ball passes the paddle on the x-axis and is in front of the back of the paddle
		if (this.ball.x - this.ball.r < this.playerPaddle.x + this.playerPaddle.w && this.ball.x > this.playerPaddle.x){
			
			//If the paddle hits the front of the paddle in the middle
			if (this.ball.y < this.playerPaddle.y + this.playerPaddle.h + this.ball.r && this.ball.y > this.playerPaddle.y){
					score += 1
					this.vy = getRandomInt(3, 20)
					this.ball.vx = Math.abs(this.ball.vx)
			}

			//This is if the ball hits the bottom of the paddle
			if (this.playerPaddle.y + this.playerPaddle.h > this.ball.y - this.ball.r){ //< this.playerPaddle.y + this.playerPaddle.h){
				if (this.ball.y> this.playerPaddle.y + this.playerPaddle.h - this.ball.r){
					score += 1
					this.ball.vy *= -1
					this.ball.vx = Math.abs(this.ball.vx)
					this.clearBottomPaddle()
					this.clearBallPaddleHit()
					this.ball.y += this.playerPaddle.y + this.playerPaddle.h - (this.ball.y - this.ball.r)
				}
			}
			
			//This is if the ball hits the top of the paddle
			if (this.ball.y + this.ball.r > this.playerPaddle.y){
				if (this.ball.y < this.playerPaddle.y + this.ball.r){
					score += 1
					this.ball.vy *= -1
					this.ball.vx = Math.abs(this.ball.vx)
					this.clearTopPaddle()
					this.clearBallPaddleHit()
					this.ball.y -= this.ball.y + this.ball.r - this.playerPaddle.y
				}
			}
		}
	}
	
	this.hitComputer = function(){
		if (this.ball.x + this.ball.r > this.computerPaddle.x && this.ball.x < this.computerPaddle.x){
			if (this.ball.y < this.computerPaddle.y + this.computerPaddle.h + this.ball.r && this.ball.y > this.computerPaddle.y){
				this.ball.vx *= -1
			}
		}
	}
	
	this.updateClock = function(){
		clockTime += 1/60
		normalTime = clockTime.toString().split(".")[0]
	}
	
	this.clearPaddle = function(){
		//Clears user paddle
		ctx.clearRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.w, this.playerPaddle.h)
	
		//Clears CPU Paddle
		ctx.clearRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.w, this.computerPaddle.h)
	}
	
	this.draw = function(){
		this.clearBall()
		this.clearPaddle()
		
		this.keepText()
		
		this.ball.update()
		this.ball.draw(ctx)
		
		this.playerPaddle.update()
		this.moveComputerPaddle()
		
		ctx.fillStyle = "#7bc043"
		this.playerPaddle.makePaddle(ctx)
		
		ctx.fillStyle = "#0392cf"
		this.computerPaddle.makePaddle(ctx)
		
		ctx.fillStyle = "black"
		
		this.hitComputer()
		this.hitPaddle()
		
		this.updateClock()
		
		this.endGame()
	}
	
	this.startGame = function(){
		
	}
	
	this.startGame = function(){
		self = this
		loop = setInterval('self.draw()', 1000/60)
	}
}
	
myGame = new game()

myGame.startGame()
