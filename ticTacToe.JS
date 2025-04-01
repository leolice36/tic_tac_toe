const gameBoard = {
    cells: {
        row1: { col1: 0, col2: 0, col3: 0 },
        row2: { col1: 0, col2: 0, col3: 0 },
        row3: { col1: 0, col2: 0, col3: 0 }
    },

    dimensions: 3,
    generateCells: function(dimensions) {
        const cellReplacement = {}
        this.dimensions = dimensions;
        for (let i = 1; i <= dimensions; i++){
            cellReplacement[`row${i}`] = {};
            for (let j = 1; j <=dimensions; j++){
                cellReplacement[`row${i}`][`col${j}`] = 0;
            }    
        }
        this.cells = cellReplacement;
        console.table(this.cells)
    },
    updateValue: function(rowNum, colNum, newValue) {
        const rowIndex = rowNum - 1;
        const colIndex = colNum - 1;
        const rowKeys = Object.keys(this.cells);
        const colKeys = Object.keys(this.cells[rowKeys[0]]); // Get column keys from any row
        const rowKey = rowKeys[rowIndex];  // Get actual row key (e.g., "row1")
        const colKey = colKeys[colIndex];  // Get actual column key (e.g., "col1")
        
        if (rowKey === undefined || colKeys === undefined) {
            console.log('requesting mark beyond dimensions')
            return "fail"
        } else if (this.cells[rowKey][colKey] !== 0) {
            return "fail"
        } else if (rowIndex >= 0 && rowIndex < rowKeys.length && colIndex >= 0 && colIndex < colKeys.length && this.cells[rowKey][colKey] === 0) { // Check if rowIndex and colIndex are within valid range
            this.cells[rowKey][colKey] = newValue;
            return "pass"
        } else { 
            return "error"
        }
    },
  
    reset: function() {
        for (let row in this.cells) {
            for (let col in this.cells[row]) {
                this.cells[row][col] = 0;
            }
        }
    },
    
    allEqualAndNotZero: function(row) {
        let values = Object.values(row);
        return values.every(v => v !== 0 && v === values[0]);
    },
  
    extractColumnValuesAsArray: function() {
        // Get all column names dynamically
        const columnNames = Object.keys(Object.values(this.cells)[0]);

        // Initialize an object to store columns dynamically
        const columns = Object.fromEntries(columnNames.map(col => [col, []]));

        // Fill the columns with values from each row
        Object.values(this.cells).forEach(row => {
            columnNames.forEach(col => {
                columns[col].push(row[col]);
            });
        });

        return columns; // Return the extracted column values
    },                                 
    check: function() {
        function consolidateCheck (checkerObj) {
            if (checkerObj.includes(true)) {
            return true
          } else {
            return false
          }
        }
      
        // Loop through each row and check
        const rowsCheck = () => {
          const rowCheck = [];
          Object.entries(this.cells).forEach(([row]) => {
          const check = this.allEqualAndNotZero(row)
          rowCheck.push(check)
          });
        //   console.log(`rowCheck: ${rowCheck}`)
          return consolidateCheck(rowCheck)
        }
      
        // Loop through each column and check
        const colsCheck = () => {
          const colCheck = [];
          Object.entries(this.extractColumnValuesAsArray()).forEach(([col]) => {
          const check = this.allEqualAndNotZero(col)
          colCheck.push(check)
          });
        //   console.log(`colCheck: ${colCheck}`)
          return consolidateCheck(colCheck)
        }

      // Check top-left - bot right diagonal
        const tlbrCheck = () => {
          const rows = Object.keys(this.cells);
          const numberOfRows = Object.keys(this.cells).length;
          // Check top left - bot right diagonal
          const tlbr = [];
          for (let i = 1; i <= numberOfRows; i++) {
            const cellsIndex = i-1;
            const columns = Object.keys(this.cells[rows[cellsIndex]]); // ["col1", "col2", "col3"]
            const colIndex = cellsIndex; // Same index as rowIndex
            const value = this.cells[rows[cellsIndex]][columns[colIndex]];
            tlbr.push(value)
          }
            const check = this.allEqualAndNotZero(tlbr)
            return check
        }
        

        // Check top right - bot left diagonal
        const trblCheck = () => {
          const rows = Object.keys(this.cells);
          const numberOfRows = Object.keys(this.cells).length;
          // Check top left - bot right diagonal
          const trbl = [];
          for (let i = 1; i <= numberOfRows; i++) {
            const cellsIndex = i-1;
            const columns = Object.keys(this.cells[rows[cellsIndex]]); // ["col1", "col2", "col3"]
            const colIndex = numberOfRows-cellsIndex-1; // Same index as rowIndex
            const value = this.cells[rows[cellsIndex]][columns[colIndex]];
            trbl.push(value)
          }
            const check = this.allEqualAndNotZero(trbl)
            return check
        }
      
        const finalCheck = [rowsCheck(),colsCheck(),tlbrCheck(),trblCheck()]
        console.log(finalCheck)
        return finalCheck.includes(true)
    },
    test: function() {
    }
};


const play = {
  start: function () {
    
    gameBoard.reset()
    console.log('CHOOSE ENEMY choosePlayer2(bot/human)')
    console.log('CHOOSE board dimension setBoard(cells per side)')
    console.log('ROCK PAPER SCISSORS: rockPaperScissors.play("ROCK/PAPER/SCISSORS")')
    console.log('GAME START')
    console.table(gameBoard.cells)
  },
  players: {
    player1: 'human', 
    player2: 'bot'
  },
  choosePlayer2: function(player) {
    if (player === 'bot' || player === 'human') {
        this.players.player2 = player
        console.table(this.players)
    } else {
        console.log('invalid input, choose human OR bot')
    }
  },
  setBoard: function (dimensions) {
    //const dimensions = //something here that refers to DOM
    if (dimensions >= 3) {
        gameBoard.generateCells(dimensions)
    } else {
        console.log('Please enter a value of 3 or greater')
    }
  },
  turn: 'player1'
  ,
  status: 'roundInSession',  
  move: function (move){
    function isValidFormat(str) {
      if ((/[a-zA-Z]|\d+/g).test(str)) {
          return true;
      } else {
          return false;
      }
    }
    function separateLettersAndNumbers(input) {
        return input.match(/[a-zA-Z]|\d+/g);
    }
    function createStringToggler(current, value1, value2) {
      return function () {
          current = current === value1 ? value2 : value1;
          return current;
      };
    }
    const togglePlayer = createStringToggler(this.turn, "player1", "player2");
    if (isValidFormat(move)) {
        
      const moveArr = separateLettersAndNumbers(move)
      console.log(moveArr)
      const rowNum =  moveArr[1];
      const colNum =  moveArr[3];
      const marker = this.turn === 'player1'? "X" : "O";
      //tries to update board, has a filter on the updateValue method.
      let valueUpdateCheck = gameBoard.updateValue(rowNum, colNum, marker);
      if (valueUpdateCheck === 'fail') {
        console.log(`invalid choice, still ${this.turn}'s' turn`)
      } else if (valueUpdateCheck === 'pass'){
        if (gameBoard.check()) {    
            console.table(gameBoard.cells)
            console.log(`${play.turn} WINS!`)
            gameBoard.reset()
        } else {
            console.table(gameBoard.cells)
            this.turn = togglePlayer()
            console.log(`${this.turn} turn`)
        }
      } else {
        console.log(`invalid syntax, still ${this.turn}'s' turn`)
      }
    }
    
  }       
}

const rockPaperScissors = {
    getHumanChoice: function(humanChoice){
        if (humanChoice === null) {
            console.log("Prompt was canceled. Returning 'CANCELED'.")
        } else {
            return humanChoice
        }
    },
    getComputerChoice: function(humanChoiceFinal){
        function convertToSeed(rawChoice){
            if (rawChoice === "ROCK"){
                return 1;
            }
            else if (rawChoice === "PAPER"){
                return 2;
            }
            else if (rawChoice === "SCISSORS"){
                return 3;
            }
            else if (rawChoice === "CANCELED") {
                return undefined
            }
        }
        function pseudoRNG(seed) {
            if (seed === undefined){
                return 
            }
            else if (![1, 2, 3].includes(seed)) {
                throw new Error("Invalid seed. Seed must be 1, 2, or 3.");
            }
            else {
        
                // Generate a random number between 0 and 1
                const rand = Math.random();
        
                // 33% chance to match the seed
                if (rand < 0.33) {
                    return seed;
                }
        
                // 36% chance to "beat" the seed
                else if (rand < 0.69) {
                    // Beat logic: 1 beats 3, 2 beats 1, 3 beats 2
                    if (seed === 1) return 2;
                    if (seed === 2) return 3;
                    if (seed === 3) return 1;
                }
        
                // 31% chance to return something other than seed or "beat"
                else {
                    let options = [1, 2, 3].filter(num => num !== seed && num !== (seed % 3) + 1);
                    return options[Math.floor(Math.random()*options.length)];
                }
            }
        }
        if (humanChoiceFinal === undefined )
            console.log("WHAT A BITCH");
        else {
            let humanChoiceConverted = convertToSeed(humanChoiceFinal)
            let computerChoice = pseudoRNG(humanChoiceConverted)
            let computerChoiceFinal;
            if (computerChoice === undefined) {
                computerChoiceFinal = "CANCELED";
            } else if (computerChoice == 1){
                computerChoiceFinal = "ROCK";
            } else if (computerChoice == 2) {
                computerChoiceFinal = "PAPER";
            } else if (computerChoice == 3) {
                computerChoiceFinal = "SCISSORS";
            }
        return computerChoiceFinal
        }
    },
    rpsScore: {
        humanScore: 0,
        computerScore: 0
    },
    checkGame: function() {
        const humanScore = this.rpsScore.humanScore
        const computerScore = this.rpsScore.computerScore
        if (humanScore > computerScore) {
            if (play.players.player2 === 'human'){
                console.log(`Player 1 WIN!`);
            } else {
                console.log(`HUMAN WIN!`);
            }
            play.turn = 'player1'
            this.rpsScore.humanScore = 0
        } else if (humanScore < computerScore) {
            if (play.players.player2 === 'human'){
                console.log(`Player 2 WIN!`);
            } else {
                console.log(`COMPUTER WIN!`);
            }
            play.turn = 'player2'
            this.rpsScore.computerScore = 0
        }
    },
    play: function(humanChoice) {
        this.getHumanChoice(humanChoice);
        let computerChoice = this.getComputerChoice(humanChoice);
        
        if (humanChoice ==='CANCELED') {
            console.log("Exiting game.");
            return
        }
    
        if (humanChoice === computerChoice){
            console.log("AGAIN!")
            this.checkGame()
            return
        }
        else if(
            (humanChoice === "ROCK" && computerChoice === "SCISSORS")
            || (humanChoice === "SCISSORS" && computerChoice === "PAPER")
            || (humanChoice === "PAPER" && computerChoice === "ROCK")
            ){
            this.rpsScore.humanScore = 1; 
            console.log(this.rpsScore.humanScore)
            this.checkGame()
        }
        else{
            this.rpsScore.computerScore = 1
            console.log(this.rpsScore.computerScore)
            this.checkGame()
        }
        console.log(`${play.turn} turn`)
    }
}

const bot = {
    defineLineObj: function() {
        const lines = [];

        function defineRows(){
            for (const [row, col] of Object.entries(gameBoard.cells)){
                lines[row] = Object.values(col)
            }
        }

        function defineCols() {
            const columnNames = Object.keys(Object.values(gameBoard.cells)[0]);
    
            // Initialize an object to store columns dynamically
            const columns = Object.fromEntries(columnNames.map(col => [col, []]));
    
            // Fill the columns with values from each row
            Object.values(gameBoard.cells).forEach(row => {
                columnNames.forEach(col => {
                    columns[col].push(row[col]);
                });
            });
            Object.assign(lines, columns)
        }

        function defineDiagonals(diagonalNumber) {
            const rows = Object.keys(gameBoard.cells);
            const numberOfRows = Object.keys(gameBoard.cells).length;
            const diagonal = [];

            for (let i = 1; i <= numberOfRows; i++) {
                const cellsIndex = i-1;
                const columns = Object.keys(gameBoard.cells[rows[cellsIndex]]); // ["col1", "col2", "col3"]
                if (diagonalNumber == 1) { //tlbr
                    const colIndex = cellsIndex; // Same index as rowIndex
                    const value = gameBoard.cells[rows[cellsIndex]][columns[colIndex]];
                    diagonal.push(value)
                } else if (diagonalNumber == 2) { //trbl
                    const colIndex = numberOfRows-cellsIndex-1; // Same index as rowIndex
                    const value = gameBoard.cells[rows[cellsIndex]][columns[colIndex]];
                    diagonal.push(value)
                } else {
                    console.log('invalid diagonal number')
                }
                const diaObj = {[`dia${diagonalNumber}`]: diagonal}
                Object.assign(lines, diaObj)
            }
            
        }
        defineRows()
        defineCols()
        defineDiagonals(1)
        defineDiagonals(2)
        console.table(lines)
    }
}

console.log('HELLOOOO?')