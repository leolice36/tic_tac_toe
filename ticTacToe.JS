const gameBoard = {
    cells: {
        row1: { col1: 0, col2: 0, col3: 0 },
        row2: { col1: 0, col2: 0, col3: 0 },
        row3: { col1: 0, col2: 0, col3: 0 }
    },

    dimensions: 7,
    generateCells: function() {
        const cellReplacement = {}
        const dimensions = this.dimensions;
        for (let i = 1; i <= dimensions; i++){
            cellReplacement[`row${i}`] = {};
            for (let j = 1; j <=dimensions; j++){
                cellReplacement[`row${i}`][`col${j}`] = 0;
            }    
        }
        console.table(cellReplacement)
    },
    updateValue: function(rowNum, colNum, newValue) {
        const rowIndex = rowNum - 1;
        const colIndex = colNum - 1;
        const rowKeys = Object.keys(this.cells);
        const colKeys = Object.keys(this.cells[rowKeys[0]]); // Get column keys from any row
        const rowKey = rowKeys[rowIndex];  // Get actual row key (e.g., "row1")
        const colKey = colKeys[colIndex];  // Get actual column key (e.g., "col1")
        
        if (this.cells[rowKey][colKey] !== 0) {
            return "fail"
        } else if (rowIndex >= 0 && rowIndex < rowKeys.length && colIndex >= 0 && colIndex < colKeys.length && this.cells[rowKey][colKey] === 0) { // Check if rowIndex and colIndex are within valid range
            this.cells[rowKey][colKey] = newValue;
            return "pass"
        } else { 
            return "error"
        }
    },
  
    reset: function() {
        this.cells.row1 = { col1: 0, col2: 0, col3: 0 }
        this.cells.row2 = { col1: 0, col2: 0, col3: 0 }
        this.cells.row3 = { col1: 0, col2: 0, col3: 0 }
        console.log(this.cells)
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
          Object.entries(this.cells).forEach(([rowName, row]) => {
          const check = this.allEqualAndNotZero(row)
          rowCheck.push(check)
          });
        //   console.log(`rowCheck: ${rowCheck}`)
          return consolidateCheck(rowCheck)
        }
      
        // Loop through each column and check
        const colsCheck = () => {
          const colCheck = [];
          Object.entries(this.extractColumnValuesAsArray()).forEach(([colName, col]) => {
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
    console.log('GAME START')
    gameBoard.reset()
    console.log(gameBoard.cells)
  },
  players: {
    player1: 'human', 
    player2: 'bot'
  },
  turn: 'player1'
  ,
  status: 'roundInSession',  
  move: function (move){
    function isValidFormat(str) {
      if (/^r\d+c\d+$/.test(str)) {
          return true;
      } else {
          return false;
      }
    }
    function createStringToggler(current, value1, value2) {
      return function () {
          current = current === value1 ? value2 : value1;
          return current;
      };
    }
    const togglePlayer = createStringToggler(this.turn, "player1", "player2");
    if (isValidFormat(move)) {
      const moveArr = move.split("")
      console.log(moveArr)
      const rowNum =  moveArr[1];
      const colNum =  moveArr[3];
      const marker = this.turn === 'player1'? "X" : "O";
      //tries to update board, has a filter on the updateValue method.
      let valueUpdateCheck = gameBoard.updateValue(rowNum, colNum, marker);
      if (valueUpdateCheck === 'fail') {
        console.log(`invalid choice, still ${this.turn}'s' turn`)
      } else if (valueUpdateCheck === 'pass'){
        this.turn = togglePlayer()
        console.table(gameBoard.cells)
        console.log(`${this.turn} turn`)
      } else {
        console.log(`invalid syntax, still ${this.turn}'s' turn`)
      }
    }
  }       
}

console.log('HELLOOOO?')