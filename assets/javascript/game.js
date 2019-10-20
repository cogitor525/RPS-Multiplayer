$("div.row").on("click", "button#new-game", function(event) {
    newGame();
});

const STATE = {OPEN: 1, JOINED: 2, ONE_MOVED: 3, BOTH_MOVED: 4, ONE_SCORED: 5, BOTH_SCORED: 6, RESUME: 7};
const refGames = firebase.database().ref("/games");

function newGame() {
	const openGame = {
		creator: {uid: currentUser.uid, displayName: currentUser.displayName, wins: 0},
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

	if (data.creator.uid != currentUser.uid) {
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
            game.joiner = {uid: currentUser.uid, displayName: currentUser.displayName, wins: 0};
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
let currentGameKey;

joinedGames.on("child_added", function(snapshot) {
    const data = snapshot.val();

    if ( (currentUser.uid == data.creator.uid) || (currentUser.uid == data.joiner.uid) ) {
        currentGameKey = snapshot.key;
        renderRPS();
        $("#new-game").addClass('disabled');
        $("#new-game").prop("disabled", true);
        $("#new-game").text("Game in progress");
        $(".removable").remove();
        const scores = $("<div>");
        scores.addClass('score-card');
        scores.append("<br><br><p id='creator-score'>" + data.creator.displayName + ": 0</p>");
        scores.append("<p id='joiner-score'>" + data.joiner.displayName + ": 0</p>");
        $("#play-area").append(scores);
    }
});

function renderRPS() {
    const rpsButtons = $("<div>");
    rpsButtons.addClass('rps-buttons');
    rpsButtons.append('<button class="btn btn-default rps" id="rock" type="button">Rock</button>');    
    rpsButtons.append('<button class="btn btn-default rps" id="paper" type="button">Paper</button>');    
    rpsButtons.append('<button class="btn btn-default rps" id="scissors" type="button">Scissors</button>');    

    $("#play-area").append(rpsButtons);
}