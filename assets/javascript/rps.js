$("div.row").on("click", "button.rps", function(event) {    
    const rpsHand = $(this).attr("data-rps");
    const key = $(this).parents("div.game-card").attr('id');

    $("div.game-card#" + key).find("p.game-msg").text("You played: " + rpsHand);

    // need to restore these buttons after turn is resolved
    $(this).addClass('disabled').prop("disabled", true);
    $(this).siblings("button.rps").addClass('disabled').prop("disabled", true);

    enterMove(key, rpsHand);
});

// **
let isCreator;

function enterMove(key, move) {
    refGames.child(key).transaction(function(game) {
        if (currentUserId == game.creator.uid) {
            game.creator.move = move;
            isCreator = true;
        } else if (currentUserId == game.joiner.uid) {
            game.joiner.move = move;
            isCreator = false;
        }

        if ( (game.state == STATE.JOINED) || (game.state == STATE.RESUME) ) {
            game.state = STATE.ONE_MOVED;
        } else if (game.state == STATE.ONE_MOVED) {
            game.state = STATE.BOTH_MOVED;
        }

        return game;
    });
}

const bothMoved = refGames.orderByChild("state").equalTo(STATE.BOTH_MOVED);

bothMoved.on("child_added", function(snapshot) {
    if (isCreator) {
        const creatorMove = snapshot.val().creator.move;
        const joinerMove = snapshot.val().joiner.move;

        const winLoss = resolveTurn(creatorMove,joinerMove);
        updateScoreFirst(snapshot.key, winLoss);
    }
});

function updateScoreFirst(key, creatorWL) {
    refGames.child(key).transaction(function(game) {
        let message;
        if (creatorWL == "win") {
            game.creator.wins++;
            game.winner = "creator";
            message = game.creator.move + " wins over " + game.joiner.move;
        } else if (creatorWL == "loss") {
            game.joiner.wins++;
            game.winner = "joiner";
            message = game.creator.move + " loses to " + game.joiner.move;
        } else if (creatorWL == "tie") {
            game.winner = "tied";
            message = "tie: both played " + game.creator.move;
        }
        $("div.game-card#" + key).find("p.game-msg").text(message);
        game.state = STATE.ONE_SCORED;
        return game;
    });
}

function resolveTurn(creator,joiner) {
    if (creator == "rock") {
        switch(joiner) {
            case "rock": return "tie";
            case "paper": return "loss";
            case "scissors": return "win";
        }
    } else if (creator == "paper") {
        switch(joiner) {
            case "rock": return "win";
            case "paper": return "tie";
            case "scissors": return "loss";
        }
    } else if (creator == "scissors") {
        switch(joiner) {
            case "rock": return "loss";
            case "paper": return "win";
            case "scissors": return "tie";
        }
    }
}