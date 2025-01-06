// multiBall.js

export const multiBallLogic = (balls, setBalls, bricks, setBricks, paddle, setScore, score, level, canvas) => {
    const ctx = canvas.getContext('2d');
    
    const drawBall = (ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();
    };
  
    const updateBalls = (balls) => {
      let newScore = score;
      let newBalls = balls.map((ball) => {
        let newBall = { ...ball };
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;
  
        // Ball collision with walls
        if (newBall.x + newBall.radius > canvas.width || newBall.x - newBall.radius < 0) {
          newBall.dx *= -1;
        }
        if (newBall.y - newBall.radius < 0) {
          newBall.dy *= -1;
        }
  
        // Ball collision with paddle
        if (
          newBall.x > paddle.x &&
          newBall.x < paddle.x + paddle.width &&
          newBall.y + newBall.radius > paddle.y
        ) {
          newBall.dy *= -1;
        }
  
        // Ball collision with bricks
        const newBricks = bricks.map((row, rowIndex) =>
          row.map((brick, colIndex) => {
            if (
              brick.visible &&
              newBall.x > brick.x &&
              newBall.x < brick.x + brick.width &&
              newBall.y > brick.y &&
              newBall.y < brick.y + brick.height
            ) {
              newBall.dy *= -1;
              newScore += 10; // Base score for hitting a brick
  
              // Handle brick breaking for Level 2
              if (level === 2) {
                const pairedIndex = colIndex % 2 === 0 ? colIndex + 1 : colIndex - 1;
                if (row[pairedIndex] && row[pairedIndex].color === brick.color) {
                  row[pairedIndex].visible = false; // Break the paired brick
                  newScore += 10; // Extra score for breaking paired brick
                }
              }
  
              return { ...brick, visible: false };
            }
            return brick;
          })
        );
  
        setScore(newScore);
  
        return newBall;
      });
  
      setBalls(newBalls);
      setBricks(newBalls[0].bricks);
    };
  
    return updateBalls;
  };
  