"use strict";

// Defines Hub
let connection = new signalR.HubConnectionBuilder().withUrl("/pollHub").build();

// Opens Connection to Hub
connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Listens for GameStarted, routes to COUPLE Vote page
connection.on("GameStarted", function(user) {
    $(location).attr('href', '/Couple/Vote')
  });

// On Click, if Username, show waiting room and broadcast username
$(document).ready(function () {
    $('#joinGame').on('click', function () {
        let username = $('#username').val() 
        if (username) {
            // Set Username
            localStorage.setItem("username", username);
            showWaitingRoom();
            // sendCoupleNameToHost(username);
            // // Need to sort gameId stuff
            // let gameId = 1;
            // postToDatabase(username, gameId);
        }
    });
})

// Hides Lobby, shows Waiting Room
function showWaitingRoom() {
    if ($('#lobby').css('display') != 'none') {
        $('#waitingRoom').show().siblings('div').hide();
    }
}

// Sends Couple Name to Hub
function sendCoupleNameToHost(username) {
    console.log("Sending Couple");
    connection.invoke("SendCouple", username).catch(function (err) {
        return console.error(err.toString());
    });   
}

// Checks if its Couple 1 or Couple 2
// NEEDS TESTING!!
function firstPersonJoining(gameId) {
    // Get Game API
    fetch(`/api/Game/${gameId}`)
    .then(response => response.json())
    .then(game => {
        // If Couple One exists, return false
        // If it doesn't exist return true
        console.log(game);
        if (game.coupleOne) {
            console.log(game.coupleOne)
            return false
        } else {
            return true
        }
    })
}
    
// Posts Couple Name to Database
function postToDatabase(username, gameId) {
    if (firstPersonJoining(gameId)) {
        var data = {
            coupleOne: username
        }
    } else {
        var data = {
            coupleTwo: username
        }
    }
    // Might need a callback here, test it.
    fetch(`/api/Game/${gameId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    // .then($(location).attr('href', '/Couple/Vote'))
}

// Is this needed?
connection.on("ReceiveUid", function(uid) {
    console.log(uid);
  });
