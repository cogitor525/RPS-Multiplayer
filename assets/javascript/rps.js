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
        // render gamepage
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
        // render gamepage
    })
    .catch(function(err) {
        alert(err.message);
    });
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