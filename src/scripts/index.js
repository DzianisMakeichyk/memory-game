require('../styles/index.scss');
// Card list
let cardImages = [];
let random = [];

const attempts = 100;
const numItemsToGenerate = 8; //how many gallery items you want on the screen
const collectionID = 139386; //the collection ID from the original url

function renderGalleryItem(randomNumber) {
    fetch(`https://source.unsplash.com/collection/${collectionID}/${randomNumber}`)
        .then((response) => {
            // CheckOut if images aren`t repeat and max visible
            if(cardImages.indexOf(response.url) === -1 && cardImages.length < numItemsToGenerate*2) {
                cardImages.push(response.url);
            }
        })
        .then(() => {
            if(cardImages.length === numItemsToGenerate) {
                // Duplicate images
                cardImages = cardImages.concat(cardImages);

                document.querySelector('.deck__loading').style.display = "none";

                initGame();
            }
        })
        .catch(err => {console.log('Error happened during fetching!', err)});
}

// Random non repeat numbers
if(cardImages.length <= numItemsToGenerate) {
    for(let i = 0; i < attempts ; i++) {
        let temp = Math.floor(Math.random()*attempts);

        if(random.indexOf(temp) === -1) {
            random.push(temp);

            renderGalleryItem(random[i]);
        } else
            i--;
    }
}

function initGame() {
    shuffle(cardImages);
    // CheckOut max visible
    if(cardImages.length === numItemsToGenerate*2) {
        for (let i = 0; i < cardImages.length; i++) {
            const card = document.createElement("li");
            card.classList.add("card");
            card.innerHTML = `<div class="card__image" style="background-image: url(${cardImages[i]})"></div>`;
            deck.appendChild(card);

            handleCard(card);
        }
    }
}
/*
 * Initialize game
 */
const deck = document.querySelector(".deck");
let openCards = [];
let matchCards = [];

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Click event
 */
function handleCard(card) {
    card.addEventListener("click", function() {
        startTimer();

        // Show card
        openCards.length <= 1 ? openCard(card) : '';

        let firstCard = openCards[0];
        let secondCard = openCards[1];

        // Check for match
        isMatching(firstCard, secondCard);
    });
}

/*
 * Open and show card
 */
function openCard(card) {
    openCards.push(card);

    card.classList.add("open", "show", "disable");
}

/*
 * Check for matches
 */
function isMatching(firstCard, secondCard) {
    if (openCards.length === 2) {
        if (firstCard.innerHTML === secondCard.innerHTML) {

            firstCard.classList.add("match");
            firstCard.classList.remove("open", "show");

            secondCard.classList.add("match");
            secondCard.classList.remove("open", "show");

            matchCards.push(firstCard, secondCard);

            openCards = [];


            // Check if game is over
            gameOver();
        } else {
            setTimeout(() => {
                openCards.map(card => card.classList.remove("open", "show", "disable"))
                openCards = [];
            }, 1000);
        }

        moveCount();
    }
}

/*
 * Count moves
 */
const moveDisplay = document.querySelector(".moves");
let moves = 0;

function moveCount() {
    moves++;
    moveDisplay.innerText = moves;
}

/*
 * Timer
 */
const timeDisplay = document.querySelector(".timer");
let time = 0;
let gameTimer;
let timerRunning = false;

function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        gameTimer = setInterval(function() {
            time++;
            timeDisplay.innerText = time;
        }, 1000);
    }
}

function stopTimer() {
    timerRunning ? timerRunning = false : clearInterval(gameTimer);
}

/*
 * Check if game is over
 */
const win = document.getElementById("win");

function gameOver() {
    const totalMoves = document.querySelector("#moves");
    const playTime = document.querySelector("#playTime");

    setTimeout(function() {
        if (matchCards.length === cardImages.length) {
            // Display winning msg
            win.style.display = "block";

            // Update stats
            totalMoves.innerText = moves;
            playTime.innerText = time;

            stopTimer();
        }
    }, 750);
}

/*
 * Restart game
 */
function restartGame() {

    deck.innerHTML = "";

    moves = 0;
    moveDisplay.innerText = moves;

    stopTimer();
    time = 0;
    timeDisplay.innerText = time;
    clearInterval(gameTimer);

    matchCards = [];
    openCards = [];

    initGame();
}

// Restart button
const restart = document.querySelector(".restart");

restart.addEventListener("click", function() {
    restartGame();
});

// Play again button
const playAgain = document.querySelector("#playAgain");

playAgain.addEventListener("click", function() {
    win.style.display = "none";

    restartGame();
});
