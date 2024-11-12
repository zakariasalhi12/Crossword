// Main crosswordSolver function
function crosswordSolver(emptyPuzzle, words) {
    // Validate inputs
    if (!validateInput(emptyPuzzle, words)) {
        console.log('Error');
        return;
    }

    // Sort 'words' from longest to shortest
    words.sort((a, b) => b.length - a.length);
    const shortest = words[words.length - 1].length;
    const wordStarts = [];
    let counter = 0; // To track the number of placed words

    // Render 'emptyPuzzle' into 2D array (array of arrays of strings)
    const grid = emptyPuzzle.split('\n').map(line => line.split(''));
    const height = grid.length;
    const width = grid[0].length;

    // Call the function to identify starting points
    counter = startPoints(grid, width, height, shortest, wordStarts, counter);

    // Check if 'counter' matches the number of words
    if (counter !== words.length) {
        console.log('Error');
        return;
    }

    // Attempt to solve the puzzle and output the result
    if (solve(words, wordStarts, grid, width, height)) {
        console.log(grid.map(row => row.join('')).join('\n'));
    } else {
        console.log('Error');
    }
}

function validateInput(emptyPuzzle, words) {
    // Validate emptyPuzzle type and check if words or emptyPuzzle are empty
    if (emptyPuzzle.length === 0 || words.length === 0 || words.length < 3 || typeof emptyPuzzle !== 'string') {
        return false;
    }

    // Check type of words to ensure they are all strings
    for (let i = 0; i < words.length; i++) {
        if (typeof words[i] !== 'string') {
            return false;
        }
    }

    // Check if emptyPuzzle contains invalid characters and count the number of words
    let wordCount = 0;
    for (let i = 0; i < emptyPuzzle.length; i++) {
        const char = emptyPuzzle[i];
        if (char !== '\n' && char !== '0' && char !== '1' && char !== '2' && char !== '.') {
            return false;
        }

        // Count the occurrences of '1' and '2' to compare with the words list
        if (char !== '.' && char !== '\n') {
            wordCount += Number(char);
        }
    }

    // Compare the number of words in the emptyPuzzle with the words array length
    if (wordCount !== words.length) {
        return false;
    }

    // Check if any word is repeated
    let wordsMap = new Map();
    for (let i = 0; i < words.length; i++) {
        if (!wordsMap.has(words[i])) {
            wordsMap.set(words[i], true);
        } else {
            return false; // Word is repeated
        }
    }

    return true;
}

// Function to check if a word can be placed at the given start position
function canPlace(word, start, grid, width, height) {
    let { row, col, direction } = start;
    for (let i = 0; i < word.length; i++) {
        if (row >= height || col >= width) {
            return false;
        }
        if (grid[row][col] !== '0' && grid[row][col] !== '1' && grid[row][col] !== '2' && grid[row][col] !== word[i]) {
            return false;
        }
        if (direction === 'horizontal') {
            col++;
        }else {
            row++;
        }
    }
    return true;
}

// Function to place the word in the grid
function place(word, start, grid) {
    let { row, col, direction } = start;
    for (let i = 0; i < word.length; i++) {
        grid[row][col] = word[i];
        direction === 'horizontal' ? col++ : row++;
    }
}

// Function to remove the word from the grid (for backtracking)
function remove(word, start, grid) {
    let { row, col, direction } = start;
    for (let i = 0; i < word.length; i++) {
        grid[row][col] = '0';
        direction === 'horizontal' ? col++ : row++;
    }
}

// Function to solve the crossword puzzle
function solve(words, wordStarts, grid, width, height, index = 0) {
    if (index === words.length) return true; // All words have been placed
    const word = words[index];
    for (const start of wordStarts) {
        if (canPlace(word, start, grid, width, height)) {
            place(word, start, grid);
            if (solve(words, wordStarts, grid, width, height, index + 1)) {
                return true;
            }
            remove(word, start, grid);
        }
    }
    return false;
}

// Helper function to check if a word can fit horizontally
function canFitH(row, col, grid, width, shortest) {
    let endCol = col;
    while (endCol < width && (grid[row][endCol] === '0' || grid[row][endCol] === '1' || grid[row][endCol] === '2')) {
        endCol++;
    }
    return (endCol - col) >= shortest;
}

// Helper function to check if a word can fit vertically
function canFitV(row, col, grid, height, shortest) {
    let endRow = row;
    while (endRow < height && (grid[endRow][col] === '0' || grid[endRow][col] === '1' || grid[endRow][col] === '2')) {
        endRow++;
    }
    return (endRow - row) >= shortest;
}

// Identify potential starting points for placement
function startPoints(grid, width, height, shortest, wordStarts, count) {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const cell = grid[i][j];

            // Update the count based on the cell's value
            if (cell === '2') count += 2;
            else if (cell === '1') count += 1;

            // Check if the cell is a potential starting point (1 or 2)
            if (cell === '1' || cell === '2') {
                // Check horizontally
                if ((j === 0 || grid[i][j - 1] === '0' || grid[i][j - 1] === '.') && canFitH(i, j, grid, width, shortest)) {
                    wordStarts.push({ row: i, col: j, direction: 'horizontal' });
                }

                // Check vertically
                if ((i === 0 || grid[i - 1][j] === '0' || grid[i - 1][j] === '.') && canFitV(i, j, grid, height, shortest)) {
                    wordStarts.push({ row: i, col: j, direction: 'vertical' });
                }
            }
        }
    }
    return count;
}


const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()

crosswordSolver(puzzle, words)

/* output:
`casa
i..l
anta
o..n`
*/