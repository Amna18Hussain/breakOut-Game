import React, { useState, useEffect } from 'react';

const initializeBalls = (level) => {
  const balls = [];
  for (let i = 0; i < level; i++) {
    balls.push({
      x: 290,
      y: 290,
      dx: 2 + i,
      dy: -2 - i,
      visible: true,
    });
  }
  return balls;
};

const moveBalls = (balls, paddleX, paddleWidth, canvas, setGameOver, level) => {
  balls.forEach((ball) => {
    if (ball.x + ball.dx > canvas.width - 10 || ball.x + ball.dx < 10) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < 10) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - 10) {
      if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
        ball.dy = -ball.dy;
      } else {
        balls = balls.filter((b) => b !== ball);
        if (balls.length === 0) setGameOver(true);
      }
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
  });
};

const Game = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const paddleHeight = 15;
  const paddleWidth = 1500;
  let paddleX = 200;

  const brickWidth = 75;
  const brickHeight = 20;
  const brickColumnCount = 6;
  const brickPadding = 10;
  let bricks = [];
  let balls = [];

  const initializeBricks = (level) => {
    const newBricks = [];
    const rows = level;
    const colorPairs = ['#bb5cae', '#bb9cae', '#bb6cae'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < brickColumnCount; c++) {
        newBricks.push({
          x: c * (brickWidth + brickPadding) + 30,
          y: r * (brickHeight + brickPadding) + 30,
          status: 1,
          color: colorPairs[(c + r) % colorPairs.length],
        });
      }
    }
    return newBricks;
  };

  useEffect(() => {
    bricks = initializeBricks(level);
    balls = initializeBalls(level);

    const canvas = document.getElementById('gameCanvas');
    canvas.width = 580;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');

    const keyDownHandler = (e) => {
      if (e.key === 'ArrowLeft' && paddleX > 0) {
        paddleX -= 40;
      } else if (e.key === 'ArrowRight' && paddleX < canvas.width - paddleWidth) {
        paddleX += 40;
      }
    };
    window.addEventListener('keydown', keyDownHandler);

    const drawBall = (ball) => {
      if (ball.visible) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
      }
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      bricks.forEach((brick) => {
        if (brick.status === 1) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
          ctx.fillStyle = brick.color;
          ctx.fill();
          ctx.closePath();
        }
      });
    };

    const collisionDetection = () => {
      bricks.forEach((brick) => {
        if (brick.status === 1) {
          balls.forEach((ball) => {
            if (
              ball.x + 10 > brick.x &&
              ball.x - 10 < brick.x + brickWidth &&
              ball.y + 10 > brick.y &&
              ball.y - 10 < brick.y + brickHeight
            ) {
              if (ball.x > brick.x && ball.x < brick.x + brickWidth) {
                ball.dy = -ball.dy;
              } else {
                ball.dx = -ball.dx;
              }

              if (level >= 3) {
                if (brick.color === '#FF5733') {
                  const sameColorBricks = bricks.filter(
                    (otherBrick) =>
                      otherBrick.status === 1 && otherBrick.color === '#FF5733'
                  );
                  if (sameColorBricks.length >= 2) {
                    sameColorBricks.slice(0, 2).forEach((sameColorBrick) => {
                      sameColorBrick.status = 0;
                    });
                    setScore((prev) => prev + 10);
                  }
                } else {
                  brick.color = '#FF5733';
                }
              } else {
                brick.status = 0;
                setScore((prev) => prev + 5);
              }
            }
          });
        }
      });

      if (bricks.every((brick) => brick.status === 0)) {
        if (level < 4) {
          setLevel((prev) => prev + 1);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawPaddle();
      balls.forEach((ball) => drawBall(ball));
      collisionDetection();
      moveBalls(balls, paddleX, paddleWidth, canvas, setGameOver, level);

      if (level === 4 && bricks.every((brick) => brick.status === 0)) {
        balls.forEach((ball) => {
          ball.visible = false;
        });

        ctx.font = '30px Arial';
        ctx.fillStyle = 'purple';
        ctx.textAlign = 'center';
        ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
      }
    };

    const interval = setInterval(() => {
      if (!gameOver) draw();
    }, 10);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [paddleX, gameOver, level]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setLevel(1);
  };

  return (
    <div className="Game">
      <h1>BreakOut Game</h1>
      <div>
        <div className="score-level-container">
          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <button className="restart-btn" onClick={resetGame}>
                Restart
              </button>
            </div>
          )}
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div>
        </div>

        <canvas id="gameCanvas"></canvas>
      </div>
    </div>
  );
};

export default Game;
