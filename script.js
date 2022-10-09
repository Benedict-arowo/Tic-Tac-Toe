const items = document.querySelectorAll('.gameboard div')
const winnerDisplay = document.getElementById('stats--container')
const winnerParagraph = document.getElementById('stats--paragraph') 
const resetBtn = document.getElementById('reset--btn')
const current = document.getElementById('current--player')
const playerConfig = document.getElementById('player--config')
const playBtn = document.getElementById('play--btn')
const fields = document.querySelectorAll('.playerField')
const menu = document.getElementById('menu')
const newGameBtn = document.getElementById('new-game--btn')

let currentPlayer;
let player1;
let player2;

function Player(name, marker) {
    this.name = name
    this.marker = marker
}

playBtn.addEventListener('click', (e) => {
        let player = [];
        let error = null

        fields.forEach(field => {
            player.push( {
                name: field.value,
            })
        })
        // Checks if both players have a name.
        try {
            if (player[0].name.length < 3 || player[1].name.length < 3) {
                throw new Error('Name must be at least 3 characters.')
            }
            else if (player[0].name == player[1].name) {
                throw new Error('Both players can\'t have the same name.')
            }
        }
        catch (err) {
            error = err.message
            console.error(err.message)
        }

        // If there is no error the game starts.
        if ( error == null ) {
            player1 = new Player(player[0].name, 'X');
            player2 = new Player(player[1].name, 'O');
            currentPlayer = player1
            gameboard.startgame()
        }
    })

const gameboard = {
    board: [ 
        ['', '', ''],
        ['', '', ''],
        ['', '', ''] 
    ],
    updateDisplay: () => {
        const board = gameboard.board;
        let result = 0;
        // Checks every board item, if they're all filled up and there is no winner yet, then it calls it as a draw.
        board.forEach(boardItem => { 
            result = boardItem.every(child => child.length > 0) ? result + 1 : result
            if (result == 3) {
                gameboard.endgame({mode: 'draw'})
            }
        })
        // Fills up the DOM with the gameboard contents
        items.forEach(item => {
            const itemProps = {
                id: item.dataset.id, 
                position: item.dataset.position
            }
            item.innerText = gameboard.board[itemProps.position][itemProps.id];
        })
        current.innerText = currentPlayer.name;
    },
    startgame: () => {
        menu.style.display = 'none'; // Removes the menu from the DOM
        gameboard.updateDisplay();
    },
    endgame: ({mode, winner}) => {
        if (mode == 'draw') {
            winnerParagraph.innerText = `Draw`;
        }
        else {
            winnerParagraph.innerText = `${winner.name} has won the game`;
        }
        winnerDisplay.style.cssText = 'opacity: 1; user-select: all;';
    },
    reset: () => {
        gameboard.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        gameboard.updateDisplay()
        winnerDisplay.style.cssText = 'opacity: 0; user-select: none;';
    },

}


newGameBtn.addEventListener('click', () => {
    gameboard.reset()
    player1 = null
    player2 = null
    // Resets the players, show's the menu and removes the winner display
    fields.forEach(field => field.value = '') // Resets the input fields value.
    menu.style.display = 'grid';
    winnerDisplay.style.cssText = 'opacity: 0; user-select: none;';
})

resetBtn.addEventListener('click', e => {
    gameboard.reset()
})

items.forEach(item => {
    item.addEventListener('click', (e) => {
        const itemProps = { // Stores item id, and position
            id: e.currentTarget.dataset.id, 
            position: e.currentTarget.dataset.position
        }
        currentItem = gameboard.board[itemProps.position][itemProps.id] 
        if (currentItem == '') { // Makes sure the current field is empty.
            gameboard.board[itemProps.position][itemProps.id] = currentPlayer.marker
            currentPlayer = currentPlayer == player1 ? player2 : player1 // Changes the current player to the next player. If the current player has made a valid move.
        }
        gameboard.updateDisplay()
        validatePlay()
    })
})

const validatePlay = () => {
    board = gameboard.board
    
    // Rows

    if(
        board[0][0] != '' && board[0][0] == board[0][1] && board[0][0] == board[0][2] 
        || board[1][0] != '' && board[1][0] == board[1][1] && board[1][0] == board[1][2]
        || board[2][0] != '' && board[2][0] == board[2][1] && board[2][0] == board[2][2] ) {
            gameboard.endgame({mode: 'win', winner: currentPlayer })
    }    
    // Colomns
    
    else if(
            board[0][0] != '' && board[0][0] == board[1][0] && board[0][0] == board[2][0] 
        || board[0][1] != '' && board[0][1] == board[1][1] && board[0][1] == board[2][1]
        || board[0][2] != '' && board[0][2] == board[1][2] && board[0][2] == board[2][2] ) {
            gameboard.endgame({mode: 'win', winner: currentPlayer })
    }
    
    // Diagonals 
    
    else if (
            board[0][0] != '' && board[0][0] == board[1][1] && board[0][0] == board[2][2] 
        || board[0][2] != '' && board[0][2] == board[1][1] && board[0][2] == board[2][0] ) {
            gameboard.endgame({mode: 'win', winner: currentPlayer })
    }
}

