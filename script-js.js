// Game configuration
const config = {
    modes: {
        single: { maxRounds: 1, requiredWins: 1 },
        bestOf3: { maxRounds: 3, requiredWins: 2 },
        bestOf5: { maxRounds: 5, requiredWins: 3 }
    },
    choices: ['rock', 'paper', 'scissors'],
    choiceEmojis: { 'rock': '🪨', 'paper': '📄', 'scissors': '✂️' }
};

// Game state
let gameState = {
    player1Name: '',
    player2Name: '',
    currentMode: 'single',
    currentRound: 1,
    scores: { player1: 0, player2: 0 },
    player1Choice: null,
    player2Choice: null,
    result: null
};

// DOM Elements
const elements = {
    setupScreen: document.getElementById('setup-screen'),
    gameScreen: document.getElementById('game-screen'),
    player1NameInput: document.getElementById('player1-name'),
    player2NameInput: document.getElementById('player2-name'),
    modeButtons: document.querySelectorAll('.mode-button'),
    startButton: document.getElementById('start-game'),
    roundDisplay: document.getElementById('round-display'),
    currentRoundSpan: document.getElementById('current-round'),
    maxRoundsSpan: document.getElementById('max-rounds'),
    scorePlayer1Span: document.getElementById('score-player1'),
    scorePlayer2Span: document.getElementById('score-player2'),
    scorePills: document.getElementById('score-pills'),
    countdown: document.getElementById('countdown'),
    player1Display: document.getElementById('player1-display'),
    player2Display: document.getElementById('player2-display'),
    player1Choice: document.getElementById('player1-choice'),
    player2Choice: document.getElementById('player2-choice'),
    vsDisplay: document.getElementById('vs-display'),
    resultBox: document.getElementById('result-box'),
    resultText: document.getElementById('result-text'),
    winnerAnnouncement: document.getElementById('winner-announcement'),
    nextRoundButton: document.getElementById('next-round'),
    playAgainButton: document.getElementById('play-again'),
    resetGameButton: document.getElementById('reset-game')
};

// Initialize game
function init() {
    // Set up event listeners
    elements.modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            setGameMode(mode);
        });
    });
    
    elements.startButton.addEventListener('click', startGame);
    elements.nextRoundButton.addEventListener('click', startNextRound);
    elements.playAgainButton.addEventListener('click', playAgain);
    elements.resetGameButton.addEventListener('click', resetGame);
    
    // Set default mode
    setGameMode('single');
}

// Set game mode
function setGameMode(mode) {
    gameState.currentMode = mode;
    
    elements.modeButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-mode') === mode) {
            button.classList.add('selected');
        }
    });
}

// Start the game
function startGame() {
    // Get player names
    gameState.player1Name = elements.player1NameInput.value.trim() || 'צד 1';
    gameState.player2Name = elements.player2NameInput.value.trim() || 'צד 2';
    
    // Reset scores and round
    gameState.scores.player1 = 0;
    gameState.scores.player2 = 0;
    gameState.currentRound = 1;
    
    // Update UI
    elements.player1Display.textContent = gameState.player1Name;
    elements.player2Display.textContent = gameState.player2Name;
    
    // Show game screen
    elements.setupScreen.style.display = 'none';
    elements.gameScreen.style.display = 'block';
    
    // Update round display for multi-round games
    if (gameState.currentMode !== 'single') {
        updateRoundDisplay();
        elements.roundDisplay.classList.remove('hidden');
    } else {
        elements.roundDisplay.classList.add('hidden');
    }
    
    // Start countdown
    startCountdown();
}

// Update round display
function updateRoundDisplay() {
    const { currentMode, currentRound, scores } = gameState;
    const { maxRounds, requiredWins } = config.modes[currentMode];
    
    elements.currentRoundSpan.textContent = currentRound;
    elements.maxRoundsSpan.textContent = maxRounds;
    elements.scorePlayer1Span.textContent = scores.player1;
    elements.scorePlayer2Span.textContent = scores.player2;
    
    // Update score pills
    elements.scorePills.innerHTML = '';
    
    // Player 1 pills
    for (let i = 0; i < requiredWins; i++) {
        const pill = document.createElement('div');
        pill.className = `score-pill ${i < scores.player1 ? 'filled' : ''}`;
        elements.scorePills.appendChild(pill);
    }
    
    // Separator
    const separator = document.createElement('div');
    separator.className = 'score-separator';
    separator.textContent = '-';
    elements.scorePills.appendChild(separator);
    
    // Player 2 pills
    for (let i = 0; i < requiredWins; i++) {
        const pill = document.createElement('div');
        pill.className = `score-pill ${i < scores.player2 ? 'filled' : ''}`;
        elements.scorePills.appendChild(pill);
    }
}

// Start countdown
function startCountdown() {
    elements.countdown.classList.remove('hidden');
    elements.player1Choice.textContent = '?';
    elements.player2Choice.textContent = '?';
    elements.player1Choice.classList.remove('selected');
    elements.player2Choice.classList.remove('selected');
    
    elements.resultBox.classList.add('hidden');
    elements.winnerAnnouncement.classList.add('hidden');
    elements.nextRoundButton.classList.add('hidden');
    elements.playAgainButton.classList.add('hidden');
    elements.resetGameButton.classList.add('hidden');
    
    let count = 3;
    elements.countdown.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            elements.countdown.textContent = count;
        } else {
            clearInterval(countdownInterval);
            elements.countdown.textContent = 'הגרלה!';
            
            setTimeout(() => {
                elements.countdown.classList.add('hidden');
                makeRandomChoices();
            }, 1000);
        }
    }, 1000);
}

// Make random choices
function makeRandomChoices() {
    // Make final random choices
    gameState.player1Choice = config.choices[Math.floor(Math.random() * 3)];
    gameState.player2Choice = config.choices[Math.floor(Math.random() * 3)];
    
    // Update display
    elements.player1Choice.textContent = config.choiceEmojis[gameState.player1Choice];
    elements.player2Choice.textContent = config.choiceEmojis[gameState.player2Choice];
    elements.player1Choice.classList.add('selected');
    elements.player2Choice.classList.add('selected');
    
    // Determine winner after a short delay
    setTimeout(() => {
        determineWinner();
    }, 1000);
}

// Determine winner
function determineWinner() {
    const { player1Choice, player2Choice } = gameState;
    
    let result;
    
    if (player1Choice === player2Choice) {
        result = 'tie';
    } else if (
        (player1Choice === 'rock' && player2Choice === 'scissors') ||
        (player1Choice === 'paper' && player2Choice === 'rock') ||
        (player1Choice === 'scissors' && player2Choice === 'paper')
    ) {
        result = 'player1';
        gameState.scores.player1++;
    } else {
        result = 'player2';
        gameState.scores.player2++;
    }
    
    gameState.result = result;
    
    // Display result
    showResult(result);
    
    // Update round display for multi-round games
    if (gameState.currentMode !== 'single') {
        updateRoundDisplay();
    }
    
    // Check if the game is over
    checkGameOver();
}

// Show round result
function showResult(result) {
    const { player1Name, player2Name, player1Choice, player2Choice } = gameState;
    
    elements.resultBox.classList.remove('hidden', 'tie', 'win');
    
    if (result === 'tie') {
        elements.resultBox.classList.add('tie');
        elements.resultText.innerHTML = `תיקו! שני הצדדים בחרו אותו דבר.`;
    } else {
        elements.resultBox.classList.add('win');
        const winnerName = result === 'player1' ? player1Name : player2Name;
        const winnerChoice = result === 'player1' ? player1Choice : player2Choice;
        const loserChoice = result === 'player1' ? player2Choice : player1Choice;
        
        elements.resultText.innerHTML = `${winnerName} ניצח! ${config.choiceEmojis[winnerChoice]} מנצח את ${config.choiceEmojis[loserChoice]}`;
    }
}

// Check if the game is over
function checkGameOver() {
    const { currentMode, scores, currentRound } = gameState;
    const { maxRounds, requiredWins } = config.modes[currentMode];
    
    // Check if a player has won
    const gameOver = scores.player1 >= requiredWins || scores.player2 >= requiredWins || currentRound >= maxRounds;
    
    if (gameOver) {
        // Display the final winner
        if (scores.player1 >= requiredWins) {
            elements.winnerAnnouncement.textContent = `${gameState.player1Name} ניצח במשחק! 🏆`;
            elements.winnerAnnouncement.classList.remove('hidden');
        } else if (scores.player2 >= requiredWins) {
            elements.winnerAnnouncement.textContent = `${gameState.player2Name} ניצח במשחק! 🏆`;
            elements.winnerAnnouncement.classList.remove('hidden');
        }
        
        // Show play again and reset buttons
        elements.playAgainButton.classList.remove('hidden');
        elements.resetGameButton.classList.remove('hidden');
    } else if (gameState.currentMode !== 'single') {
        // Show next round button
        elements.nextRoundButton.classList.remove('hidden');
    } else {
        // Single game - show play again and reset buttons
        elements.playAgainButton.classList.remove('hidden');
        elements.resetGameButton.classList.remove('hidden');
    }
}

// Start next round
function startNextRound() {
    gameState.currentRound++;
    startCountdown();
}

// Play again with same players
function playAgain() {
    gameState.scores.player1 = 0;
    gameState.scores.player2 = 0;
    gameState.currentRound = 1;
    
    if (gameState.currentMode !== 'single') {
        updateRoundDisplay();
    }
    
    startCountdown();
}

// Reset the game completely
function resetGame() {
    elements.setupScreen.style.display = 'block';
    elements.gameScreen.style.display = 'none';
    
    elements.player1NameInput.value = '';
    elements.player2NameInput.value = '';
    
    gameState = {
        player1Name: '',
        player2Name: '',
        currentMode: gameState.currentMode,
        currentRound: 1,
        scores: { player1: 0, player2: 0 },
        player1Choice: null,
        player2Choice: null,
        result: null
    };
}

// Initialize the game
window.addEventListener('DOMContentLoaded', init);