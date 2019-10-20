const creatorScored = refGames.orderByChild("state").equalTo(STATE.ONE_SCORED);

creatorScored.on("child_added", function(snapshot) {
    const game = snapshot.val();
    $("#creator-score").text(game.creator.displayName + ": " + game.creator.wins);
    $("#joiner-score").text(game.joiner.displayName + ": " + game.joiner.wins);
    if (!isCreator) {
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
        refGames.child(currentGameKey).update({
            state: STATE.BOTH_SCORED
        });
    }
});

const bothScored = refGames.orderByChild("state").equalTo(STATE.BOTH_SCORED);

bothScored.on("child_added", function(snapshot) {
    // restoring play buttons
    $(".rps").removeClass('disabled');
    $(".rps").prop("disabled", false);

    refGames.child(currentGameKey).update({
        state: STATE.RESUME
    });
});