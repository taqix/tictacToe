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
    
    
    
 
    
    
    
  }
  isMovesLeft(arr: Element[][]){
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (arr[i][j].innerHTML == "")
                return true;
                 
    return false;
  }
  giveValue(arr: Element[][]){

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
