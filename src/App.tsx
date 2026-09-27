import "./App.css";
import {useState, useEffect} from "react";

function App() {
  const [gameBoard, setGameBoard] = useState<number[][]>([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  const [score, setScore] = useState<number>(0);
  function Restart(){
    setGameBoard(NewBlock([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]], false));
  }

  function GameOver(successful:boolean){
    if(successful){
      alert("성공!");
    }else{
      alert("실패");
    }
    Restart();
  }

  function AddScore(newTile:number){
    setScore(score => score+newTile);
    if(newTile == 128){
      GameOver(true);
    }
  }

  function NewBlock(board: number[][], checkOnly:boolean){
    let blanks = [];
    let newGameBoard = board.map(row => [...row]);

    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        if(board[i][j] != 0) continue;
        blanks.push(i*4+j);
      }
    }
    if(blanks.length <= 0){
      GameOver(false);
    }
    else{
      if(checkOnly) return newGameBoard;
      let newPos = blanks[Math.floor(Math.random()*blanks.length)];
      newGameBoard[Math.floor(newPos/4)][newPos%4] = 2;
    }      
    return newGameBoard;
  }

  function MoveBoard(x: number, y:number){
    let newGameBoard = gameBoard.map(row=>[...row]);
    let changed = false;
    let d = x;
    if(x ==0) d = y;
    NewBlock(newGameBoard, true);
    if(true){
      for(let ii = 0; ii < 4; ii++){
        let this_line = [];
        for(let jj = 0; jj < 4; jj++){
          let i = ii; let j = jj;
          if(x==0){
            i = jj; j = ii;
          }
          let this_value = gameBoard[i][j];
          if(this_value!=0) this_line.push(this_value);
        }
        for(let k = 0; k < this_line.length; k++){
          let kk = k;
          if(d>0) kk = this_line.length-1-k;
          if(this_line[kk]==this_line[kk-d]){
            this_line[kk] *=2;
            this_line[kk-d] = 0;
            AddScore(this_line[kk]);
          }
        }
        this_line = this_line.filter(v => v>0);
        let original_length = this_line.length;
        let new_line = [];
        if(d>0){
          for(let t=0; t <4-original_length; t++) 
            new_line.push(0);
          for(let t=0; t <original_length; t++)
            new_line.push(this_line[t]);
        }
        else {
          new_line=this_line;
          for(let t=0; t <4-original_length; t++) 
            new_line.push(0);
        }
        for(let t = 0; t < 4; t++){
          let i = ii; let j = t;
          if(x==0){
            i = t; j = ii;
          }
          if(newGameBoard[i][j] == new_line[t]) continue;
          changed = true;
          newGameBoard[i][j] = new_line[t];
        }
      }
    }
    if(changed){
      newGameBoard = NewBlock(newGameBoard, false);
      setGameBoard(newGameBoard);
    }
  }
  
  useEffect(()=>{
    function onKeyboardInput(event: KeyboardEvent){
      switch(event.key){
        case "ArrowUp":
          MoveBoard(0,-1);
          break;
        case "ArrowDown":
          MoveBoard(0,1);
          break;
        case "ArrowRight":
          MoveBoard(1,0);
          break;
        case "ArrowLeft":
          MoveBoard(-1,0);
          break;
      }
    }
    window.addEventListener("keydown", onKeyboardInput);
    return (()=>window.removeEventListener("keydown", onKeyboardInput));
  },[gameBoard])

  useEffect(()=>{Restart();},[]);

  return (
    <main>
      <h1>2048 Game</h1>
      <div id="ScoreText">Score: {score}</div>
      <div id="GameBoard">
        {
          gameBoard.map(row => {
            return (
              <div className="rowOnBoard">
              {
                row.map(element =>{
                  return Block(element)
                })
              }
              </div>
            )
          })
        }
      </div>
    </main>
  );
}

function Block(n:number){
  return (
    <div className={`gameBlock block_${n}`}>
      <div className={`gameBlockText blockText_${n}`}>
        {(n>0)?n:""}
      </div>
    </div>
  )
}

export default App;
