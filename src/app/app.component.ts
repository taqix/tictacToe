import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public arrEl: Array<Element> = []
  public arrIsX: Array<boolean> = [];
  public arrIsY: Array<boolean> = [];
  public board: Element[][] = [];
  public isPlayer: boolean = true;
  ngOnInit(){
    const node = document.querySelectorAll(".boxToClick")
    this.arrEl = Array.from(node);
    this.arrEl.forEach( (val,index) =>{
      val.id = "box_"+(index+1)
      this.arrIsX.push(false)
      this.arrIsY.push(false)

    })
    let counter = 0
    for(let i=0; i<3;i++){

      this.board[i] = []
      for(let j=0; j<3;j++){
        this.board[i][j] = this.arrEl[counter]
        counter++
      }
    }
     
  }
  clickOnBox(id: string){
    if(this.isPlayer){
      this.arrIsX[Number(id.slice(-1))-1] = true
    this.arrEl[Number(id.slice(-1))-1].innerHTML = '<img src="./assets/close.png" height="20vh">'
    this.isPlayer = false
    }
    else{
      this.arrIsY[Number(id.slice(-1))-1] = true
    this.arrEl[Number(id.slice(-1))-1].innerHTML = '<img src="./assets/dry-clean.png" height="20vh">'
    this.isPlayer = true
    }
    
    
    let bestMove = this.findBestMove(this.board);
 
    console.log("The Optimal Move is :<br>");
    console.log("ROW: " + bestMove.row +
                  " COL: "+ bestMove.col + "<br>"); 
    
  }
  isMovesLeft(arr: Element[][]){
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (arr[i][j].innerHTML == "")
                return true;
                 
    return false;
  }
  evaluate(b: Element[][]){
     
    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; row++)
    {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2])
        {
            if (b[row][0].innerHTML == '<img src="./assets/close.png" height="20vh">')
                return +10;
                 
            else if (b[row][0].innerHTML == '<img src="./assets/dry-clean.png" height="20vh">')
                return -10;
        }
    }
  
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; col++)
    {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col])
        {
            if (b[0][col].innerHTML == '<img src="./assets/close.png" height="20vh">')
                return +10;
  
            else if (b[0][col].innerHTML == '<img src="./assets/dry-clean.png" height="20vh">')
                return -10;
        }
    }
  
    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
        if (b[0][0].innerHTML == '<img src="./assets/close.png" height="20vh">')
            return +10;
             
        else if (b[0][0].innerHTML == '<img src="./assets/dry-clean.png" height="20vh">')
            return -10;
    }
  
    if (b[0][2] == b[1][1] &&
        b[1][1] == b[2][0])
    {
        if (b[0][2].innerHTML == '<img src="./assets/close.png" height="20vh">')
            return +10;
             
        else if (b[0][2].innerHTML == '<img src="./assets/dry-clean.png" height="20vh">')
            return -10;
    }
  
    // Else if none of them have
    // won then return 0
    return 0;
}
    minimax(board: Element[][], depth: number, isMax: boolean){
    let score = this.evaluate(board);
  
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
        return score;
  
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
        return score;
  
    // If there are no more moves and
    // no winner then it is a tie
    if (this.isMovesLeft(board) == false)
        return 0;
  
    // If this maximizer's move
    if (isMax)
    {
        let best = -1000;
  
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                 
                // Check if cell is empty
                if (board[i][j].innerHTML=="")
                {
                     
                    // Make the move
                    board[i][j].innerHTML = '<img src="./assets/close.png" height="20vh">';
  
                    // Call minimax recursively
                    // and choose the maximum value
                    best = Math.max(best, this.minimax(board,
                                    depth + 1, !isMax));
  
                    // Undo the move
                    board[i][j].innerHTML = "";
                }
            }
        }
        return best;
    }
  
    // If this minimizer's move
    else
    {
        let best = 1000;
  
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                 
                // Check if cell is empty
                if (board[i][j].innerHTML == "")
                {
                     
                    // Make the move
                    board[i][j].innerHTML = '<img src="./assets/dry-clean.png" height="20vh">';
  
                    // Call minimax recursively and
                    // choose the minimum value
                    best = Math.min(best, this.minimax(board,
                                    depth + 1, !isMax));
  
                    // Undo the move
                    board[i][j].innerHTML = "";
                }
            }
        }
        return best;
    }
}
  findBestMove(board: Element[][]){
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;
  
    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
             
            // Check if cell is empty
            if (board[i][j].innerHTML == "")
            {
                 
                // Make the move
                board[i][j].innerHTML = '<img src="./assets/close.png" height="20vh">';
  
                // compute evaluation function
                // for this move.
                let moveVal = this.minimax(board, 0, false);
  
                // Undo the move
                board[i][j].innerHTML = "";
  
                // If the value of the current move
                // is more than the best value, then
                // update best
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
  
    console.log("The value of the best Move " +
                   "is : ", bestVal + "<br><br>");
  
    return bestMove;
}
}
class Move
{
  public row: number;
  public col: number;
  constructor(){
    this.row = 0;
    this.col = 0;
  }
}
