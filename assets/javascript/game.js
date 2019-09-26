$("div.row").on("click", "button#new-game", function(event) {
    newGame();
});

const STATE = {OPEN: 1, JOINED: 2};
const refGames = firebase.database().ref("/games");

function newGame() {
    const user = firebase.auth().currentUser;
	const openGame = {
		creator: {uid: user.uid, displayName: user.displayName},
		state: STATE.OPEN
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

	if (data.creator.uid != firebase.auth().currentUser.uid) {
		addOpenGameButton(snapshot.key, data);
	}
});

function addOpenGameButton(key, data) {
    const name = data.creator.displayName;
    $("#game-list").append('<br><br><button class="btn btn-default join-game" id="' + key + '" type="button">Join game with ' + name + '</button>');
}

$("div.row").on("click", "button.join-game", function(event) {
    const key = $(this).attr('id');
    joinGame(key);
});

function joinGame(key) {
    const user = firebase.auth().currentUser;

    refGames.child(key).transaction(function(game) {
        if (!game.joiner) {
            game.state = STATE.JOINED;
            game.joiner = {uid: user.uid, displayName: user.displayName};
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
    const user = firebase.auth().currentUser;

    if ( (user.uid == data.creator.uid) || (user.uid == data.joiner.uid) ) {
        renderRPS();
        $("#new-game").addClass('disabled');
        $("#new-game").prop("disabled", true);
        $("#new-game").text("Game in progress");
        $(".join-game").remove();
    }
});

function renderRPS() {
    const rpsButtons = $("<div>");
    rpsButtons.addClass('btn-toolbar');
    rpsButtons.append('<button class="btn btn-default" id="rock" type="button">Rock</button>');    
    rpsButtons.append('<button class="btn btn-default" id="paper" type="button">Paper</button>');    
    rpsButtons.append('<button class="btn btn-default" id="scissors" type="button">Scissors</button>');    

    $("#play-area").append(rpsButtons);
}