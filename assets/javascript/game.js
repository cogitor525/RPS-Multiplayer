$("div.row").on("click", "button#new-game", function(event) {
    newGame();
});

const STATE = {OPEN: 1, JOINED: 2, ONE_MOVED: 3, BOTH_MOVED: 4, ONE_SCORED: 5, BOTH_SCORED: 6, RESUME: 7};
const refGames = firebase.database().ref("/games");

function newGame() {
	const openGame = {
		creator: {uid: currentUserId, displayName: currentUserName, wins: 0},
        state: STATE.OPEN,
        winner: null
	};
    refGames.push().set(openGame)
    .then(function() {
        $("#new-game").addClass('disabled');
        $("#new-game").prop("disabled", true);
        $("#new-game").text("Waiting for opponent");
    });
}

const openGames = refGames.orderByChild("state").equalTo(STATE.OPEN);

openGames.on("child_added", function(snapshot) {
	const data = snapshot.val();

	if (data.creator.uid != currentUserId) {
		addOpenGameButton(snapshot.key, data);
	}
});

function addOpenGameButton(key, data) {
    const name = data.creator.displayName;
    const newButton = $("<div>");
    newButton.addClass('removable');
    newButton.append('<br><br><button class="btn btn-default join-game" id="' + key + '" type="button">Join game with ' + name + '</button>');
    $("#game-list").append(newButton);
}

$("div.row").on("click", "button.join-game", function(event) {
    const key = $(this).attr('id');
    joinGame(key);
});

function joinGame(key) {
        refGames.child(key).transaction(function(game) {
        if (!game.joiner) {
            game.state = STATE.JOINED;
            game.joiner = {uid: currentUserId, displayName: currentUserName, wins: 0};
        }
        return game;
    });
}

openGames.on("child_removed", function(snapshot) {
    const buttonToRemove = document.querySelector("#" + snapshot.key);
    if (buttonToRemove) {
        buttonToRemove.remove();
    }
});

const joinedGames = refGames.orderByChild("state").equalTo(STATE.JOINED);

joinedGames.on("child_added", function(snapshot) {
    const data = snapshot.val();

    if ( (currentUserId == data.creator.uid) || (currentUserId == data.joiner.uid) ) {
        renderRPS(snapshot.key);
        $("#new-game").addClass('disabled');
        $("#new-game").prop("disabled", true);
        $("#new-game").text("Game in progress");
        $(".removable").remove();

        const scores = $("<div>");
        scores.addClass('score-card');
        scores.append("<br><p class='game-msg'>Good luck!</p>");
        scores.append("<p class='creator-score'>" + data.creator.displayName + ": 0</p>");
        scores.append("<p class='joiner-score'>" + data.joiner.displayName + ": 0</p>");
        $("div.game-card#" + snapshot.key).append(scores);
    }
});

function renderRPS(key) {
    const gameCard = $("<div>");
    gameCard.addClass('game-card');
    gameCard.attr('id', key);

    const rpsButtons = $("<div>");
    rpsButtons.addClass('rps-buttons');
    rpsButtons.append('<button class="btn btn-default rps" data-rps="rock" type="button">Rock</button>');    
    rpsButtons.append('<button class="btn btn-default rps" data-rps="paper" type="button">Paper</button>');    
    rpsButtons.append('<button class="btn btn-default rps" data-rps="scissors" type="button">Scissors</button>');    

    gameCard.append(rpsButtons);
    $("#play-area").append(gameCard);
}