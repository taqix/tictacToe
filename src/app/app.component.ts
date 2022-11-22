import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public arrEl: Array<Element> = [];
  public arrIsX: Array<boolean> = [];
  public arrIsO: Array<boolean> = [];
  public board: Element[][] = [];
  public counterOfChanges: number = 0;
  public resultsOfGame: string = '';
  public isPlayer: boolean = true;
  private currentId: number = 0;
  private ai: string = '<img src="./assets/dry-clean.png" height="20vh">';
  private player: string = '<img src="./assets/close.png" height="20vh">';
  private isWon: boolean = false;
  private isDrawn: boolean = false;
  public arrWinEl: Element[] = []
  public classOfBox(){
    return {
      'winner' : this.isWon,
      'drawn' : this.isDrawn
    }
    
  };
  ngOnInit() {
    const node = document.querySelectorAll('.boxToClick');
    this.arrEl = Array.from(node);
    this.arrEl.forEach((val, index) => {
      val.id = 'box_' + (index + 1);
      this.arrIsX.push(false);
      this.arrIsO.push(false);
    });
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      
      this.board[i] = [];
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = this.arrEl[counter];
        counter++;
      }
    }
  }
  isMoveAvailable(board: Element[][]) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (board[i][j].innerHTML == '') return true;
    return false;
  }
  clickOnBox(id: string) {
    if (!this.isWon) {
      if (this.arrEl[Number(id.slice(-1)) - 1].innerHTML == '') {
        if (this.isPlayer) {
          this.currentId = Number(id.slice(-1)) - 1;
          this.arrIsX[this.currentId] = true;
          
          this.arrEl[Number(id.slice(-1)) - 1].innerHTML =
            '<img src="./assets/close.png" height="20vh">';

          if (this.isMoveAvailable(this.board))
            this.nextMove(this.board, this.counterOfChanges);
          if (this.isWin(this.board) != null) {
            let winner = '';
            switch (this.isWin(this.board)) {
              case 10:
                winner = 'Wygrał Komputer';
                this.isWon = true;
                break;
              case -10:
                winner = 'Wygrał Gracz';
                this.isWon = true;
                break;
              case 0:
                winner = 'Remis';
                this.isDrawn = true;
                break;
            }
            this.resultsOfGame = winner;
          }
          console.log(this.isDrawn);
        }
      }
    }
  console.log(this.arrIsO,this.arrIsX);
  }
  nextMove(board: Element[][], counter: number) {
    if (counter == 0) {
      this.firstCheck(board);
    } else {
      let bestScore = -Infinity; //nadanie bestScore najmniejszej wartości, żeby zawsze poznać wartość ruchu
      let bestMove = { i: 0, j: 0 };
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //czy jest możliwe postawienie O
          if (board[i][j].innerHTML == '') {
            board[i][j].innerHTML = this.ai;
            let score = this.minimax(board, 0, false);

            board[i][j].innerHTML = '';
            if (score > bestScore) {
              bestScore = score;
              bestMove = { i, j };
            }
          }
        }
      }
      board[bestMove.i][bestMove.j].innerHTML = this.ai;
      console.log(this.currentId)
      this.arrEl.forEach((val, index) => {
        if (board[bestMove.i][bestMove.j] === val) {
          this.currentId = index;
          
        }
      });

      this.arrIsO[this.currentId] = true;
      console.log(this.arrIsO,this.arrIsX);
      this.isPlayer = true;
    }
    this.counterOfChanges++;
    this.arrWinEl.length = 0
    console.log(this.arrWinEl)
  }
  firstCheck(board: Element[][]) {
    let bestMove = { i: 0, j: 0 };
    if (board[1][1].innerHTML === this.player) {
      bestMove = { i: 0, j: 0 };
    } else {
      bestMove = { i: 1, j: 1 };
    }
    board[bestMove.i][bestMove.j].innerHTML = this.ai;
    this.arrEl.forEach((val, index) => {
      if (board[bestMove.i][bestMove.j] === val) {
        this.currentId = index;
        
      }
    });
    this.arrIsO[this.currentId] = true;
    console.log(this.arrIsO,this.arrIsX);
    this.isPlayer = true;
  }
  minimax(board: Element[][], depth: number, isMaximizing: boolean): number {
    let result = this.isWin(board);
    if (result != null) {
      return result;
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //czy jest możliwe postawienie O
          if (board[i][j].innerHTML == '') {
            board[i][j].innerHTML = this.ai;
            let score = this.minimax(board, depth + 1, false);
            board[i][j].innerHTML = '';
            bestScore = Math.max(score - depth, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //czy jest możliwe postawienie X
          if (board[i][j].innerHTML == '') {
            board[i][j].innerHTML = this.player;
            let score = this.minimax(board, depth + 1, true);
            board[i][j].innerHTML = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  equals3(a: string, b: string, c: string): boolean {
    return a == b && b == c && a != '';
  }
  isWin(board: Element[][]): any {
    let result = null;
    //vertical
    for (let i = 0; i < 3; i++) {
      if (
        this.equals3(
          board[0][i].innerHTML,
          board[1][i].innerHTML,
          board[2][i].innerHTML
        )
      ) {
        result = board[0][i].innerHTML === this.ai ? 10 : -10;
        this.arrWinEl[0] = board[0][i]
        this.arrWinEl[1] = board[1][i]
        this.arrWinEl[2] = board[2][i]

      }
    }
    //horizontal
    for (let i = 0; i < 3; i++) {
      if (
        this.equals3(
          board[i][0].innerHTML,
          board[i][1].innerHTML,
          board[i][2].innerHTML
        )
      ) {
        result = board[i][0].innerHTML === this.ai ? 10 : -10;
        this.arrWinEl[0] = board[i][0]
        this.arrWinEl[1] = board[i][1]
        this.arrWinEl[2] = board[i][2]
        
      }
    }
    //diagonal
    if (
      this.equals3(
        board[0][0].innerHTML,
        board[1][1].innerHTML,
        board[2][2].innerHTML
      )
    ) {
      result = board[0][0].innerHTML === this.ai ? 10 : -10;
      this.arrWinEl[0] = board[0][0]
      this.arrWinEl[1] = board[1][1]
      this.arrWinEl[2] = board[2][2]
    }
    //antiDiagonal
    if (
      this.equals3(
        board[2][0].innerHTML,
        board[1][1].innerHTML,
        board[0][2].innerHTML
      )
    ) {
      result = board[2][0].innerHTML === this.ai ? 10 : -10;
      this.arrWinEl[0] = board[2][0]
      this.arrWinEl[1] = board[1][1]
      this.arrWinEl[2] = board[0][2]
    }
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].innerHTML === '') {
          openSpots++;
        }
      }
    }

    if (result === null && openSpots === 0) {
      return 0;
    } else {
      return result;
    }
  }
}
