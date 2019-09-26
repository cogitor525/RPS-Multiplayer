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

function createAccount() {
    const name = document.querySelector("#name-input");
    const email = document.querySelector("#email-input");
    const password = document.querySelector("#pw-input");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(function() {
        firebase.auth().currentUser.updateProfile({displayName: name.value});
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
        renderGameroom();
    })
    .catch(function(err) {
        alert(err.message);
    });
}

function renderGameroom() {
    $("div.row").empty();

    // refer to assets/html/gameroom.html to see formatted layout of following code
    $("div.row").append('<div class="offset-lg-1 col-lg-4"><div class="card"><div class="card-header"></div><div class="card-body"></div></div></div><div class="col-lg-3"><div class="card"><div class="card-header"><h3 class="text-center">Games</h3></div><div class="card-body"></div></div></div><div class="col-lg-3"><div class="card"><div class="card-header"><h3 class="text-center">Chatroom</h3></div><div class="card-body"></div></div></div>');

}

// firebase.auth().onAuthStateChanged(authStateChangeListener);

// function authStateChangeListener(user) {
//     //signin
//     if (user) {
//         //do login operations
//         Chat.onlogin();
//         Game.onlogin();
//     } else { //signout
//         window.location.reload();
//     }
// }

// const database = firebase.database();

// Firebase watcher + initial loader HINT: .on("value")
// database.ref().on("value", function(snapshot) {
//     const user = snapshot.val().recentUser;
//     console.log(user);

//     $("#name-display").text(user.name);
//     $("#email-display").text(user.email);
//     $("#age-display").text(user.age);
//     $("#comment-display").text(user.comment);
// });