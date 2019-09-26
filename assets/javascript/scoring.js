// game.creator.scored = false;

const scoreCreator = refGames.orderByChild("creator/scored").equalTo(false);

scoreCreator.on("child_changed", function(snapshot) {
    const data = snapshot.val();
    if (isCreator) {
        $("#creator-score").text(data.creator.displayName + ": " + data.creator.wins);
        $("#joiner-score").text(data.joiner.displayName + ": " + data.joiner.wins);
        refGames.child("creator").update({ scored: true });
    }
});

const scoreJoiner = refGames.orderByChild("creator/scored").equalTo(true);

scoreJoiner.on("child_changed", function(snapshot) {
    const data = snapshot.val();
    if (!isCreator) {
        $("#creator-score").text(data.creator.displayName + ": " + data.creator.wins);
        $("#joiner-score").text(data.joiner.displayName + ": " + data.joiner.wins);
        // displayJoinerMsg();
        initGame();
    }
});

function initGame() {
    
}

// function displayJoinerMsg() {
//     refGames.once("value")
//     .then(function(snapshot) {

//     });
// }

// const creatorWin = refGames.orderByChild("state").equalTo(STATE.CREATOR_WIN);
// const joinerWin = refGames.orderByChild("state").equalTo(STATE.JOINER_WIN);
// const tiedGame = refGames.orderByChild("state").equalTo(STATE.TIED);

// creatorWin.on("child_added", function(snapshot) {
//     let message;
//     if (isCreator) {
//         message = snapshot.val().creator.move + " wins over " + snapshot.val().joiner.move;
//     } else {
//         message = snapshot.val().joiner.move + " loses to " + snapshot.val().creator.move;
//     }
//     renderScore(message);
// }

// joinerWin.on("child_added", function(snapshot) {
//     let message;
//     if (isCreator) {
//         message = snapshot.val().creator.move + " wins over " + snapshot.val().joiner.move;
//     } else {
//         message = snapshot.val().joiner.move + " loses to " + snapshot.val().creator.move;
//     }
//     renderScore(message);
// }

// creatorWin.on("child_added", function(snapshot) {
//     let message;
//     if (isCreator) {
//         message = snapshot.val().creator.move + " wins over " + snapshot.val().joiner.move;
//     } else {
//         message = snapshot.val().joiner.move + " loses to " + snapshot.val().creator.move;
//     }
//     renderScore(message);
// }