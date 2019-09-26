const creatorScored = refGames.orderByChild("state").equalTo(STATE.ONE_SCORED);

creatorScored.on("child_changed", function(snapshot) {
    if (!isCreator) {
        const game = snapshot.val();
        const winner = game.winner;
        let message;
        switch(winner) {
            case "creator":
                message = game.joiner.move + " loses to " + game.creator.move;
                break;
            case "joiner":
                message = game.joiner.move + " wins over " + game.creator.move;
                break;
            case "tied":
                message = "tie: both played " + game.joiner.move;
                break;
        }
        $("#new-game").text(message);
        $("#creator-score").text(data.creator.displayName + ": " + data.creator.wins);
        $("#joiner-score").text(data.joiner.displayName + ": " + data.joiner.wins);
        refGames.child(currentGameKey).transaction(function(game) {
            game.state = STATE.BOTH_SCORED;
            return game;
        });
    }
});

const bothScored = refGames.orderByChild("state").equalTo(STATE.BOTH_SCORED);

bothScored.on("child_changed", function(snapshot) {
    // restoring play buttons
    $(".rps").removeClass('disabled');
    $(".rps").prop("disabled", false);

    refGames.child(currentGameKey).transaction(function(game) {
        game.state = STATE.RESUME;
        return game;
    });
});