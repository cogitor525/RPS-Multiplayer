$("#acct-new").on("click", function(event) {
    $("div.card-header > h3").text("Create new account");

    const emailCard = $("<div>");
    emailCard.addClass("form-group");
    emailCard.append('<label for="email-input">Email</label>');
    emailCard.append('<input class="form-control" id="email-input" type="email" placeholder="email">');
    $("#name-input").parent().after(emailCard);

    $("button").remove();
    $("form").append('<button class="btn btn-default" id="acct-create" type="submit">Submit</button>');
});


// const database = firebase.database();

// database.ref().set({
//     players: null
// });

// $("#add-player").on("click", function(event) {
//     event.preventDefault();

//     const name = $("#name-input").val();
//     const newPlayer = {
//         name
//     };

//     database.ref('players').push(newPlayer);
// });

// Firebase watcher + initial loader HINT: .on("value")
// database.ref().on("value", function(snapshot) {
//     const user = snapshot.val().recentUser;
//     console.log(user);

//     $("#name-display").text(user.name);
//     $("#email-display").text(user.email);
//     $("#age-display").text(user.age);
//     $("#comment-display").text(user.comment);
// });