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
          Object.entries(this.cells).forEach(([rowName,row]) => {
          const check = this.allEqualAndNotZero(row)
          rowCheck.push(check)
          });
        //   console.log(`rowCheck: ${rowCheck}`)
          return consolidateCheck(rowCheck)
        }
      
        // Loop through each column and check
        const colsCheck = () => {
          const colCheck = [];
          Object.entries(this.extractColumnValuesAsArray()).forEach(([colName,col]) => {
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
        // console.log(finalCheck)
        return finalCheck.includes(true)
    },
    test: function() {
    }
};


const play = {
  start: function () {
    
    gameBoard.reset()
    play.status = 'gameActive';
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
  turn: 'player1'
  ,
  status: 'gameActive'
  ,  
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
        gameBoard.dimensions = dimensions;
        gameBoard.generateCells(dimensions)
    } else {
        console.log('Please enter a value of 3 or greater')
    }
  },
  declareWin: function() {
    console.log(`${play.turn} WINS!`)
    play.status = 'gameInactive';
    gameBoard.reset()
  },
  declareDraw: function() {
    console.log('DRAW')
    play.status = 'gameInactive';
    gameBoard.reset()
  },
  move: function (move){
    if (play.status === 'gameInactive'){
        console.log('Game not in session')
        return
    } else {
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
        //   console.log(moveArr)
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
                this.declareWin()
            } else if (!gameBoard.check() && bot.findZeroCells().length === 0) {
                console.table(gameBoard.cells)
                this.declareDraw()
            } else {
                console.table(gameBoard.cells)
                this.turn = togglePlayer()
                console.log(`${this.turn} turn`)
            }
          } else {
            console.log(`invalid syntax, still ${this.turn}'s' turn`)
          }
        }
    
        if (play.players.player2 === 'bot'){
            bot.take()
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
        // console.table(lines)
        return lines
    },
    findRowsWithMostValue: function(obj, targetValue) {
        let maxCount = 0;
        let maxRows = [];
    
        for (const row in obj) {
            const count = Object.values(obj[row]).filter(val => val === targetValue).length;
    
            if (count > maxCount) {
                maxCount = count;
                maxRows = [row]; 
            } else if (count === maxCount) {
                maxRows.push(row); // Add to the list of tied rows
            }
        }
    
        return {'maxRows': maxRows, 'maxCount': maxCount};
    },
    convertChosenLineToMove: function(chosenLines){
        function filterLineType(lineType){
            const filtered = chosenLines.filter(item => item.includes(lineType));
            return filtered
        }
        function extractLineNum(line){
            //eg row41 gets 41
            //takes a string
            const number = line.match(/\d+/)[0]
            return number
        }   
        const moves = [];

            const rows = filterLineType('row')
            // console.log({rows})
            for (let row in rows){
                for (let i = 1; i <= gameBoard.dimensions; i++){
                    const move = `r${extractLineNum(rows[row])}c${i}`
                    moves.push(move)
                }
            }

            const cols = filterLineType('col')
            // console.log({cols})
            for (let col in cols){
                for (let i = 1; i <= gameBoard.dimensions; i++){
                    const move = `r${i}c${extractLineNum(cols[col])}`
                    moves.push(move)
                }
            }

            const dia1 = filterLineType('dia1')
            if (dia1.length > 0){ 
                // console.log({dia1})
                for (let i = 1; i <= gameBoard.dimensions; i++){
                    const move = `r${i}c${i}`
                    moves.push(move)
                }
            }
            const dia2 = filterLineType('dia2')
            if (dia2.length > 0){ 
                // console.log({dia2})
                for (let i = 0; i <= gameBoard.dimensions-1; i++){
                    const move = `r${i+1}c${gameBoard.dimensions - i}`
                    moves.push(move)
                }
            }
            const movesNoDup = [...new Set(moves)]
            // console.log(chosenLines)
            // console.log(moves)
            // console.log(movesNoDup)
        return movesNoDup
    },
    findZeroCells: function() {
        let result = [];
    
        Object.entries(gameBoard.cells).forEach(([rowKey, cols], rowIndex) => {
            Object.entries(cols).forEach(([colKey, value], colIndex) => {
                if (value === 0) {
                    result.push(`r${rowIndex + 1}c${colIndex + 1}`);
                }
            });
        });
    
        return result;
    },
    getOverlap: function(arr1, arr2) {
        const set2 = new Set(arr2);
        return arr1.filter(item => set2.has(item));
    },
    take: function() {
        if (play.status === 'gameInactive'){
            console.log('Game not in session')
            return
        } else {
            const lines = this.defineLineObj();
            const mostX = this.findRowsWithMostValue(lines, 'X').maxRows
            const mostO = this.findRowsWithMostValue(lines, 'O').maxRows
            const mostXCount = this.findRowsWithMostValue(lines, 'X').maxCount
            const mostOCount = this.findRowsWithMostValue(lines, 'X').maxCount
            const dimension = gameBoard.dimensions;
            const centerNumber = Math.round(dimension / 2);
            const centerFour = [
                gameBoard.cells[`row${centerNumber}`][`col${centerNumber}`],
                gameBoard.cells[`row${centerNumber + 1}`][`col${centerNumber}`],
                gameBoard.cells[`row${centerNumber + 1}`][`col${centerNumber + 1}`],
                gameBoard.cells[`row${centerNumber }`][`col${centerNumber + 1}`],
            ]
            const numberOfMarkInCenterFour = centerFour.filter(val => val === 'O').length;
            const cornerFour = [
                gameBoard.cells[`row${1}`][`col${1}`],
                gameBoard.cells[`row${dimension}`][`1}`],
                gameBoard.cells[`row${dimension}`][`col${dimension}`],
                gameBoard.cells[`row${1}`][`col${dimension}`],
            ]
            // const numberOfMarkInCornerFour = cornerFour.filter(val => val === 'O').length;
            const availablePositions = bot.findZeroCells();
            const positionsInLinesX = bot.convertChosenLineToMove(mostX);
            const positionsInLinesO = bot.convertChosenLineToMove(mostO);
            const overlapXO = bot.getOverlap(positionsInLinesX,positionsInLinesO);
            const overlapXOAvail = bot.getOverlap(overlapXO,availablePositions);
            const mostXAvailable = bot.getOverlap(positionsInLinesX,availablePositions);
            const mostOAvailable = bot.getOverlap(positionsInLinesO,availablePositions);
            const win = mostOAvailable.length
            // console.log({positionsInLinesO})
            // console.log({mostOAvailable})
            // console.log({win})
            if (play.turn !== 'player2'){
                console.log('not your turn')
                return
            } else if ((((dimension % 2) !== 0)) 
                && (gameBoard.cells[`row${centerNumber}`][`col${centerNumber}`] === 0)){
                    play.move(`r${centerNumber}c${centerNumber}`)
                    
            } else if (((dimension % 2) === 0) && (numberOfMarkInCenterFour < 2)  && (centerFour.includes(0))){
                while (current !== numberOfMarkInCenterFour +1) {
                    const randomRow = Math.random() < 0.5 ? (dimension / 2) : (dimension / 2 + 1);
                    const randomCol = Math.random() < 0.5 ? (dimension / 2) : (dimension / 2 + 1);
                    play.move(`r${randomRow}c${randomCol}`)
                }
            } else if (Object.keys(mostX).length === 1 && bot.getOverlap(positionsInLinesX,availablePositions).length > 0) {
                // console.log('mostX = 1')
                const availableMoves = bot.getOverlap(positionsInLinesX,availablePositions);
                const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
                const chosenMove = availableMoves[randomMoveIndex]
                play.move(`${chosenMove}`)
            }else if ((mostOAvailable.length === 1) && (mostOCount === dimension-1)) {
                    // console.log('winning move')
                    const randomMoveIndex = Math.floor(Math.random() * mostOAvailable.length);
                    const chosenMove = mostOAvailable[randomMoveIndex]
                    play.move(`${chosenMove}`)
            } else if (mostXCount > mostOCount){
                // console.log('mostXCount > mostOCount')
                const randomMoveIndex = Math.floor(Math.random() * mostXAvailable.length);
                const chosenMove = mostXAvailable[randomMoveIndex]
                play.move(`${chosenMove}`)
            } else if (overlapXOAvail.length > 0) {
                    // console.log('overlapXOAvail.length > 0')
                    const randomMoveIndex = Math.floor(Math.random() * overlapXOAvail.length);
                    const chosenMove = overlapXOAvail[randomMoveIndex]
                    play.move(`${chosenMove}`)
            } else if (mostOAvailable.length > 0) {
                // console.log('else')
                const randomMoveIndex = Math.floor(Math.random() * mostOAvailable.length);
                const chosenMove = mostOAvailable[randomMoveIndex]
                play.move(`${chosenMove}`)
            } else {
                const randomMoveIndex = Math.floor(Math.random() * availablePositions.length);
                const chosenMove = availablePositions[randomMoveIndex]
                play.move(`${chosenMove}`)
            }
        }    
    }
}

console.log('HELLOOOO?')