$("#acct-new").on("click", function(event) {
    $("div.card-header > h3").text("Create new account");

    const nameCard = $("<div>");
    nameCard.addClass("form-group");
    nameCard.append('<label for="name-input">Name</label>');
    nameCard.append('<input class="form-control" id="name-input" type="text" placeholder="name">');
    $("form").prepend(nameCard);

    $("button").remove();
    $("form").append('<button class="btn btn-default" id="acct-create" type="submit">Submit</button>');
});

let currentUserName;
let currentUserId;

function createAccount() {
    const name = document.querySelector("#name-input");
    const email = document.querySelector("#email-input");
    const password = document.querySelector("#pw-input");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(function() {
        firebase.auth().currentUser.updateProfile({displayName: name.value});
        currentUserName = firebase.auth().currentUser.displayName;
        currentUserId = firebase.auth().currentUser.uid;
        renderGameroom();
    }).catch(function(err) {
        alert(err.message);
    });
}

$("form").on("click", "button#acct-create", function(event) {
    event.preventDefault();
    createAccount();
});

$("#acct-signin").on("click", function(event) {
    event.preventDefault();
    signinAccount();
});

function signinAccount () {
    const email = document.querySelector("#email-input");
    const password = document.querySelector("#pw-input");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(function() {
        currentUserName = firebase.auth().currentUser.displayName;
        currentUserId = firebase.auth().currentUser.uid;
        renderGameroom();
    })
    .catch(function(err) {
        alert(err.message);
    });
}

function renderGameroom() {
    $("div.jumbotron").remove();
    $("div.row").empty();

    // refer to assets/html/gameroom.html to see formatted layout of following code
    $("div.row").append('<div class="offset-lg-1 col-lg-4"><div class="card"><div class="card-header"><h3 class="text-center">Rock Paper Scissors</h3></div><div class="card-body" id="play-area"></div></div></div><div class="col-lg-3"><div class="card"><div class="card-header"><h3 class="text-center">Games</h3></div><div class="card-body" id="game-list"></div></div></div><div class="col-lg-3"><div class="card"><div class="card-header"><h3 class="text-center">Chatroom</h3></div><div class="card-body" id="chat-room"></div></div></div>');

    // for chatroom
    $("#chat-room").append('<form role="form"><div class="form-group"><textarea class="form-control" id="chat-msg" rows="1" placeholder="chat here..."></textarea></div><button class="btn btn-default" id="send-chat" type="submit">Send</button></form>');

    // for gamelist
    $("#game-list").append('<button class="btn btn-default" id="new-game" type="button">Open new game</button>');    
}