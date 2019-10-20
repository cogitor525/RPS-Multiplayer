const creatorScored = refGames.orderByChild("state").equalTo(STATE.ONE_SCORED);

creatorScored.on("child_added", function(snapshot) {
    const game = snapshot.val();
    const key = snapshot.key;

    $("div.game-card#" + key).find(".creator-score").text(game.creator.displayName + ": " + game.creator.wins);
    $("div.game-card#" + key).find(".joiner-score").text(game.joiner.displayName + ": " + game.joiner.wins);

    if (!isCreator) {
        let message;
        switch(game.winner) {
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
        $("div.game-card#" + key).find("p.game-msg").text(message);
        refGames.child(key).update({
            state: STATE.BOTH_SCORED
        });
    }
});

const bothScored = refGames.orderByChild("state").equalTo(STATE.BOTH_SCORED);

bothScored.on("child_added", function(snapshot) {
    const key = snapshot.key;

    refGames.child(key).update({
        state: STATE.RESUME
    });

    // restoring play buttons
    $("div.game-card#" + key).find("button.rps").removeClass('disabled').prop("disabled", false);
});