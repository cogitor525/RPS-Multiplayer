$("div.row").on("click", "button#send-chat", function(event) {
    event.preventDefault();
    sendChatMsg();
    $("#chat-msg").val("");
});

function sendChatMsg() {
    const chatMsg = document.querySelector("#chat-msg");

    refChat.push().set({
        name: firebase.auth().currentUser.displayName,
        message: chatMsg.value
    });
}

const refChat = firebase.database().ref("/chat");

refChat.on("child_added", function(snapshot) {
    const msg = snapshot.val();
    addChatMsg(msg.name, msg.message);
});

function addChatMsg(name, msg) {
    $("#chat-room").append("<br><strong>" + name + ":</strong> " + msg);
}