const gameBoard = {
    cells: {
        row1: { col1: 0, col2: 0, col3: 0},
        row2: { col1: 0, col2: 0, col3: 0},
        row3: { col1: 0, col2: 0, col3: 0}
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
        const boxes = document.querySelectorAll('.cell'); 
        for (let row in this.cells) {
            for (let col in this.cells[row]) {
                this.cells[row][col] = 0;
            }
        }
        for (let box of boxes) {
            box.textContent = '';
            console.log(box.textContent)
        }
        console.log(boxes)
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
  status: 'gameInactive'
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
  },
  declareDraw: function() {
    console.log('DRAW')
    play.status = 'gameInactive';
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
    
  },
  identifyWinningLine () {
    const lines = bot.defineLineObj();
    if (play.turn === 'player1'){
        const chosenLine = bot.findRowsWithMostValue(lines, 'X').maxRows
        return bot.convertChosenLineToMove(chosenLine)
    } else if (play.turn === 'player2') {
        const chosenLine = bot.findRowsWithMostValue(lines, 'O').maxRows
        return bot.convertChosenLineToMove(chosenLine)
    }
  },    
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
            const availablePositions = bot.findZeroCells();
            const positionsInLinesX = bot.convertChosenLineToMove(mostX);
            const positionsInLinesO = bot.convertChosenLineToMove(mostO);
            const overlapXO = bot.getOverlap(positionsInLinesX,positionsInLinesO);
            const overlapXOAvail = bot.getOverlap(overlapXO,availablePositions);
            const mostXAvailable = bot.getOverlap(positionsInLinesX,availablePositions);
            const mostOAvailable = bot.getOverlap(positionsInLinesO,availablePositions);
            const win = mostOAvailable.length
            let chosenMove
            if (play.turn !== 'player2'){
                console.log('not your turn')
                return
            } else if ((((dimension % 2) !== 0)) 
                && (gameBoard.cells[`row${centerNumber}`][`col${centerNumber}`] === 0)){
                    chosenMove = `r${centerNumber}c${centerNumber}`
                    const chosenBox = document.querySelector(`#${chosenMove}`)
                    chosenBox.textContent = 'O';
                    play.move(`r${centerNumber}c${centerNumber}`)
                    
            } else if (((dimension % 2) === 0) && (numberOfMarkInCenterFour < 2)  && (centerFour.includes(0))){
                while (current !== numberOfMarkInCenterFour +1) {
                    const randomRow = Math.random() < 0.5 ? (dimension / 2) : (dimension / 2 + 1);
                    const randomCol = Math.random() < 0.5 ? (dimension / 2) : (dimension / 2 + 1);
                    chosenMove = `r${randomRow}c${randomCol}`
                    const chosenBox = document.querySelector(`#${chosenMove}`)
                    chosenBox.textContent = 'O';
                    play.move(`r${randomRow}c${randomCol}`)
                }
            } else if (Object.keys(mostX).length === 1 && bot.getOverlap(positionsInLinesX,availablePositions).length > 0) {
                // console.log('mostX = 1')
                const availableMoves = bot.getOverlap(positionsInLinesX,availablePositions);
                const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
                chosenMove = availableMoves[randomMoveIndex]
                const chosenBox = document.querySelector(`#${chosenMove}`)
                chosenBox.textContent = 'O';
                play.move(`${chosenMove}`)
            }else if ((mostOAvailable.length === 1) && (mostOCount === dimension-1)) {
                    // console.log('winning move')
                    const randomMoveIndex = Math.floor(Math.random() * mostOAvailable.length);
                    chosenMove = mostOAvailable[randomMoveIndex]
                    const chosenBox = document.querySelector(`#${chosenMove}`)
                    chosenBox.textContent = 'O';
                    play.move(`${chosenMove}`)
            } else if (mostXCount > mostOCount){
                // console.log('mostXCount > mostOCount')
                const randomMoveIndex = Math.floor(Math.random() * mostXAvailable.length);
                chosenMove = mostXAvailable[randomMoveIndex]
                const chosenBox = document.querySelector(`#${chosenMove}`)
                chosenBox.textContent = 'O';
                play.move(`${chosenMove}`)
            } else if (overlapXOAvail.length > 0) {
                    // console.log('overlapXOAvail.length > 0')
                    const randomMoveIndex = Math.floor(Math.random() * overlapXOAvail.length);
                    chosenMove = overlapXOAvail[randomMoveIndex]
                    const chosenBox = document.querySelector(`#${chosenMove}`)
                    chosenBox.textContent = 'O';
                    play.move(`${chosenMove}`)
            } else if (mostOAvailable.length > 0) {
                // console.log('else')
                const randomMoveIndex = Math.floor(Math.random() * mostOAvailable.length);
                chosenMove = mostOAvailable[randomMoveIndex]
                const chosenBox = document.querySelector(`#${chosenMove}`)
                chosenBox.textContent = 'O';
                play.move(`${chosenMove}`)
            } else {
                const randomMoveIndex = Math.floor(Math.random() * availablePositions.length);
                chosenMove = availablePositions[randomMoveIndex]
                const chosenBox = document.querySelector(`#${chosenMove}`)
                chosenBox.textContent = 'O';
                play.move(`${chosenMove}`)
            }
            
            
        }    
    }
}
const boardUI = {
    dimension: 3,
    tac: document.querySelector(".tac"),
    dropMain: document.querySelector('.drop-main'),
    hitSpeed: 25,
    shoveStrength: 8,
    springReturnSpeed: 0.25,
    pos2: 0,
    originalPos2: 0,
    nArr: [],
    tacFontCounter: 2,
    gridData: {},
    boxes: [],

    init() {
        this.tac.style.top = `${this.pos2}px`;
        this.applySpringPull();
        // Ensure the animation target exists before adding listener
        const toeElement = document.querySelector('.toe');
        // if (toeElement) {
        //      toeElement.addEventListener('animationend', () => {
        //       this.startFiringSequence()
        //       });
        // } else {
        //     console.warn(".toe element not found for animationend listener.");
        // }
        setTimeout(() => {
            this.createGridFromObject(gameBoard.cells, "gridContainer");
            this.setupBoxes()
        }, 2000);



    },
    fireNewN(text) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("red-n");
        newDiv.textContent = `${text}`; // Text can be 'n' or a number

        // Ensure dropMain exists
        if (!this.dropMain) {
            console.error(".drop-main container not found.");
            return;
        }
        this.dropMain.appendChild(newDiv);


        const n = {
            el: newDiv,
            pos: -200,
            stuck: false
        };

        newDiv.style.top = `${n.pos}px`;
        this.nArr.push(n);
        this.animateN(n);
    },
    removeExcessN() {
        const maxStuckVisible = 1; // Max STUCK elements allowed

        // Filter to get stuck items AND ensure they have an 'el' property
        const stuckItems = this.nArr.filter(nItem => nItem && nItem.stuck && nItem.el);
        const stuckCount = stuckItems.length;

        if (stuckCount > maxStuckVisible) {
            const removeCount = stuckCount - maxStuckVisible;
            // console.log(`[removeExcessN] Found ${stuckCount} stuck items. Need to remove ${removeCount} older ones.`);


            const itemsToRemove = [];
            // Iterate through the original array to find the oldest stuck items
            for (let i = 0; i < this.nArr.length && itemsToRemove.length < removeCount; i++) {
                const currentItem = this.nArr[i];
                // Check item validity AND if it's stuck
                if (currentItem && currentItem.stuck && currentItem.el) {
                    itemsToRemove.push(currentItem);
                }
            }

            // console.log("[removeExcessN] Stuck items identified for removal:", itemsToRemove.map(item => item.el?.textContent));

            // Remove elements from DOM and array
            itemsToRemove.forEach(itemToRemove => {
                const indexToRemove = this.nArr.findIndex(item => item === itemToRemove);

                if (indexToRemove !== -1) {
                    // console.log(`[removeExcessN] Removing STUCK element at index ${indexToRemove}:`, itemToRemove.el.textContent);
                    if (itemToRemove.el && itemToRemove.el.parentNode) {
                        itemToRemove.el.remove();
                    } else {
                        // console.warn(`[removeExcessN] Stuck element ${itemToRemove.el?.textContent} already removed from DOM or invalid.`);
                    }
                    this.nArr.splice(indexToRemove, 1);
                } else {
                    //  console.warn(`[removeExcessN] Could not find STUCK item in nArr for removal:`, itemToRemove);
                }
            });
            // console.log(`[removeExcessN] nArr length after STUCK removal: ${this.nArr.length}`);

        } else {
            //  console.log(`[removeExcessN] ${stuckCount} stuck items found. No excess stuck items to remove.`);
        }
    },
    animateN(n) {
        const self = this;
        // Ensure tac element exists
        if (!self.tac) {
            console.error(".tac element not found for collision detection.");
            n.el.remove(); 
            const indexToRemove = self.nArr.findIndex(item => item === n);
            if (indexToRemove !== -1) self.nArr.splice(indexToRemove, 1);
            return;
        }

        function move() {
            if (n.stuck) return; // Stop animation if stuck

            n.pos += self.hitSpeed;
            n.el.style.top = `${n.pos}px`;

            const rect1 = n.el.getBoundingClientRect();
            const rect2 = self.tac.getBoundingClientRect();

            const isCollision = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top || // Collision happens when bottom of n reaches top of tac
                rect1.top > rect2.bottom);


            if (isCollision) {
                self.pos2 += self.shoveStrength; // Shove tac down
                self.tac.style.top = `${self.pos2}px`;

                n.pos = self.pos2; // Make 'n' stick to the new tac position
                n.el.style.top = `${n.pos}px`;
                n.stuck = true; // Mark as stuck

                // --- FONT WEIGHT ANIMATION ---
                self.tacFontCounter++;
                if (self.tacFontCounter > 9) self.tacFontCounter = 9; // Cap font weight
                self.tac.style.fontWeight = `${self.tacFontCounter}00`;

                (function decrementtacFontCounter() {
                    if (self.tacFontCounter <= 2) {
                        self.tacFontCounter = 2;
                        self.tac.style.transition = `font-weight 300ms linear`;
                        self.tac.style.fontWeight = `200`;
                        return;
                    }

                    // Adjust delay calculation if needed
                    const delay = Math.max(50, (9 - self.tacFontCounter) * 200); 
                    self.tac.style.transition = `font-weight ${delay}ms ease-out`;
                    // Set target weight for the transition
                    self.tac.style.fontWeight = `${(self.tacFontCounter -1)}00`;


                    setTimeout(() => {
                        self.tacFontCounter--;
                        // Rerun only if not yet at base weight
                        if (self.tacFontCounter > 2) {
                             decrementtacFontCounter();
                        } else {
                             self.tac.style.transition = `font-weight ${delay}ms ease-out`;
                             self.tac.style.fontWeight = `200`;
                        }
                    }, delay);
                })(); 
                // --- END FONT WEIGHT ANIMATION ---


                // Set dimension based on the text content ('n' or number)
                self.setDimension(n.el.textContent);

                 self.removeExcessN(); // Call cleanup

            } else {
                 // Check if element has fallen off screen
                 const boundary = window.innerHeight; // Or boundary of parent container
                 if (n.pos > boundary + 50) { // Give some buffer
                     // Remove element if it's off screen and not stuck
                     console.log("Element off screen, removing:", n.el.textContent);
                     const indexToRemove = self.nArr.findIndex(item => item === n);
                     if (indexToRemove !== -1) {
                         self.nArr.splice(indexToRemove, 1);
                     }
                     n.el.remove();
                     // Do not request further animation frames
                 } else {
                    // Continue animating if not stuck and within bounds
                     requestAnimationFrame(move);
                 }
            }
        }

        requestAnimationFrame(move);
        // Clean up excess *non-stuck* elements proactively
        setTimeout(() => self.removeExcessN(), 0); // Use timeout to avoid potential conflicts
    },
    applySpringPull() {
        const baseSpringSpeed = this.springReturnSpeed;
        const springFactor = 0.05; // How much stretch increases return speed

        if (this.pos2 > this.originalPos2) {
            const distance = this.pos2 - this.originalPos2;
            // Make return speed proportional to distance, but with a base speed
            const dynamicSpringSpeed = baseSpringSpeed + (distance * springFactor);
            this.pos2 -= dynamicSpringSpeed;
            // Prevent overshooting
            if (this.pos2 < this.originalPos2) {
                this.pos2 = this.originalPos2;
            }
            if (this.tac) { // Check if tac exists
                 this.tac.style.top = `${this.pos2}px`;
            }
        }

        // Make stuck elements follow the tac's spring movement
        this.nArr.forEach((n) => {
            if (n.stuck && n.el) { // Check if element still exists
                n.pos = this.pos2;
                n.el.style.top = `${n.pos}px`;
            }
        });

        requestAnimationFrame(this.applySpringPull.bind(this)); // Continue the spring effect
    },
    setDimension(text) {
        const previousDimension = this.dimension; // Store previous dimension

        if (text === 'n') {
            // Explicitly reset to 3x3 when 'n' is hit
            this.dimension = 3;
            console.log("Received 'n', resetting dimension to 3.");
        } else {
            // Try parsing other inputs as numbers
            const parsedValue = Number(text);
            // Validate: must be a number, > 0, and an integer
            if (!isNaN(parsedValue) && parsedValue > 0 && Number.isInteger(parsedValue)) {
                 // Add a reasonable upper limit? e.g., max 20x20
                 const maxDim = 20;
                 if (parsedValue <= maxDim) {
                     this.dimension = parsedValue + 2;
                 } else {
                     console.log(`Dimension value ${parsedValue} too large (max ${maxDim}). Keeping previous dimension: ${this.dimension}`);
                     // Keep previousDimension implicitly
                 }

            } else {
                // Invalid number or non-'n' text, keep previous dimension
                console.log("Invalid dimension value received:", text, ". Keeping previous dimension:", this.dimension);
                // Keep previousDimension implicitly
            }
        }
        gameBoard.dimensions = this.dimension;

        // Update the grid ONLY if the dimension has actually changed
        if (this.dimension !== previousDimension) {
            this.updateGrid(gameBoard.dimensions); // Call function to handle grid update
        } else {
            // console.log(`Dimension remains ${this.dimension}. No grid update needed.`); // Optional log
        }
        console.log(gameBoard.dimensions)
        console.log(this.dimension)
        return this.dimension;
    },
    setN(text, delay) {
        setTimeout(() => {
            this.fireNewN(text);
        }, delay);
    },
    startFiringSequence() {
    console.log("[startFiringSequence] Sequence initiated.");
    let delay = 2000;
    let increment = 1000;
    const decayFactor = 0.80;

    for (let i = 2; i <= 18; i++) {
      this.setN(i.toString(), delay);
      delay += increment;
      increment *= decayFactor;
      increment = Math.max(increment, 150);
    }

    // Fire the final 'n' after the last number (9) and after clearing
    console.log(`[startFiringSequence] Scheduling final 'n' (reset to 3x3) with delay: ${delay}`);
    this.setN('n', delay);
    },
    createGridFromObject(obj, containerId) {
        console.log({obj})
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("Container not found:", containerId);
            return;
        }

        container.innerHTML = '';

        const dimension = Object.keys(obj).length; // Get dimension from the object itself
        if (dimension === 0) {
             console.warn("Grid data object is empty. Cannot create grid.");
             return;
        }
        container.style.display = 'grid'; // Set display to grid
        const frTrack = `repeat(${dimension}, 1fr)`;
        container.style.gridTemplateColumns = frTrack;
        container.style.gridTemplateRows = frTrack;

        // Iterate over the object to create individual divs
        for (const rowKey in obj) {
            const rowData = obj[rowKey];
            for (const colKey in rowData) {
                const colDiv = document.createElement("div");
                colDiv.classList.add("cell");
                colDiv.classList.add(`${rowKey}`); // e.g., "row1"
                colDiv.classList.add(`${colKey}`); // e.g., "col1"
                // Use dimension from object keys length for ID generation consistency
                colDiv.id = `r${this.extractLineNum(rowKey)}c${this.extractLineNum(colKey)}`;
                if (rowData[colKey] !== 0 && rowData[colKey] !== null && rowData[colKey] !== undefined) { // Check for actual content
                    colDiv.textContent = rowData[colKey];
                } else {
                    colDiv.textContent = "\u00A0"; // Non-breaking space for empty cells
                }
                container.appendChild(colDiv);
            }
        }

        this.restyleBoard(obj); 
    },
    extractLineNum(line) {
        const match = line.match(/\d+/);
        return match ? match[0] : '0';
    },
    restyleBoard(obj) {
        const container = document.getElementById('gridContainer');
        if (!container) return;

        const dimension = Object.keys(obj).length;
        if (dimension === 0) return;

        const cells = container.querySelectorAll('.cell');

        // Remove old border classes first
        cells.forEach(cell => {
            cell.classList.remove('top-row', 'bot-row', 'left-col', 'right-col');
        });

        // Apply new border classes based on current dimension
        cells.forEach((cell) => {
            if (cell.classList.contains(`row1`)) cell.classList.add('top-row');
            if (cell.classList.contains(`row${dimension}`)) cell.classList.add('bot-row');
            if (cell.classList.contains(`col1`)) cell.classList.add('left-col');
            if (cell.classList.contains(`col${dimension}`)) cell.classList.add('right-col');
        });
    },
    updateGrid(newDimension) {
        if (typeof newDimension !== 'number' || newDimension <= 0 || !Number.isInteger(newDimension)) {
            console.error("Invalid dimension for updateGrid:", newDimension);
            return;
        }
        // Update the dimension property - already done in setDimension, but safe to ensure here
        gameBoard.dimensions = newDimension;
        play.setBoard(newDimension)
        // Re-create the grid elements and apply styles
        this.createGridFromObject(gameBoard.cells, "gridContainer"); 
        this.setupBoxes();   
    },
    cellClick(event) {
        const box = event.target;
        if (play.status !== 'gameActive'){
            return
        } else if (play.turn === 'player1') {
            box.textContent = 'X'
            play.move(`${box.id}`)
        } else if (play.turn === 'player2') {
            box.textContent = 'O'
            play.move(`${box.id}`)
        }
        box.removeEventListener('click', this.boundCellClick)
        box.classList.remove('active')
        },
    setupBoxes() {
        this.boundCellClick = this.cellClick.bind(this)
        boardUI.boxes = document.querySelectorAll('.cell');
        boardUI.boxes.forEach(box => {
            box.addEventListener('click', this.boundCellClick);
            box.classList.add('active')
            this.resizeFont()
            }) 
    },
    resizeFont() {
        const gridSize = gameBoard.dimensions;
        const fontSize = 400 / gridSize + 'px'; // Adjust for number of cells
        
        this.boxes.forEach(box => {
            box.style.fontSize = fontSize;
        });
    },
    markWinningCells () {
        const winningBoxIds = play.identifyWinningLine();
        console.table(winningBoxIds)
        for (let [index, value] of winningBoxIds.entries()){
            const boxDiv = document.querySelector(`#${value}`);
            const delay = index * 200;
            setTimeout(() => {
                boxDiv.style.backgroundColor = `#E10808`;
                boxDiv.style.fontWeight = `900`;
            },delay)
        }
        return 
    },
    markDraw () {
        const allBoxes = document.querySelectorAll('.cell');
        console.log('yas')
        let index = 1;
        
        allBoxes.forEach( box => {
            index++
            const delay = index * 50;
            console.log(delay)
            setTimeout(() => {
                box.style.backgroundColor = `black`;
                box.style.fontWeight = `900`;
                box.style.color = `#E10808`
                box.style.borderColor = `black`
            },delay)
        });
    },
    defaultUI () {
        const allBoxes = document.querySelectorAll('.cell');

        allBoxes.forEach( box => {
                box.style.backgroundColor = ``;
                box.style.fontWeight = ``;
                box.style.color = ``
                box.style.borderColor = ``
        });
    }   
};
    
    document.addEventListener('DOMContentLoaded', () => {
        // Query elements inside the listener for safety
    const tac = document.querySelector(".tac");
    const dropMain = document.querySelector('.drop-main');
    const toe = document.querySelector('.toe');
    const gridContainer = document.getElementById('gridContainer');

    if (tac && dropMain && toe && gridContainer) {
         boardUI.tac = tac;
         boardUI.dropMain = dropMain;
         boardUI.init(); // Initialize the UI object
    } else {
        console.error("One or more required HTML elements not found. Initialization aborted. Check IDs/Classes: fireBtn, .tac, .drop-main, .toe, gridContainer");
    }
});

console.log('HELLOOOO?')