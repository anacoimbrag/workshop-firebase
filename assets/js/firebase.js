var config = {
    apiKey: "AIzaSyDB19i105wUSqoGlxLdIi2s8a0aRDEb9UA",
    authDomain: "workshop-firebase-web.firebaseapp.com",
    databaseURL: "https://workshop-firebase-web.firebaseio.com",
    projectId: "workshop-firebase-web",
    storageBucket: "",
    messagingSenderId: "523334017959"
};
firebase.initializeApp(config);

// Authentication

firebase.auth().useDeviceLanguage();

var googleProvider = new firebase.auth.GoogleAuthProvider();
var facebookProvder = new firebase.auth.FacebookAuthProvider();
var twitterProvider = new firebase.auth.TwitterAuthProvider();

firebase.auth()
    .onAuthStateChanged(function(user) {
        console.log(user);
        if (user) {
            if (!window.location.pathname.includes("index.html"))
                window.location.replace("../index.html");
        } else {
            if (!window.location.pathname.includes("signup-page.html") &&
                    !window.location.pathname.includes("signin-page.html"))
                window.location.replace("./pages/signin-page.html");
        }
    });

function socialLogin(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
}

$("#signup").on('click', function() {
    var email = $("#email").val();
    var password = $("#password").val();
    var name = $("#name").val();
    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            var user = result.user;
            user.updateProfile({
                displayName: name
            }).catch(function(error) {
                var errorMessage = error.message;
                console.log(errorMessage);
            })
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
});

$("#login").on('click', function() {
    var email = $("#email").val();
    var password = $("#password").val();
    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
});


$("#google").on('click', function() {
    socialLogin(googleProvider);
});

$("#facebook").on('click', function() {
    socialLogin(facebookProvder);
});

$("#twitter").on('click', function() {
    socialLogin(twitterProvider);
});

$("#signout").on('click', function() {
    firebase.auth().signOut();
});

// Database

var db = firebase.firestore();

$(document).ready(function() {
    db.collection("tasks")
    .where("pending", "==", true)
    .onSnapshot((querySnapshot) => {
        if (querySnapshot.size > 0) 
            $("#pending").empty();
        else
            $("#pending").html("<p>Nenhuma tarefa concluída</p>");

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().description}`);
            var label = $("<label id=pending-" + doc.id + "></label><br/>");

            label.appendTo("#pending");
            var input = $('<input type="checkbox">');
            input.appendTo("#pending-" + doc.id);

            input.click(function() {
                console.log(this.checked);
                if (this.checked) {
                    completeTask(doc.id);
                }
            });

            var span = $('<span class="checkbox-material"><span class="check"></span></span>');
            span.appendTo("#pending-" + doc.id);

            label.append(doc.data().description);
        });
    });

    db.collection("tasks")
    .where("pending", "==", false)
    .onSnapshot((querySnapshot) => {
        if (querySnapshot.size > 0) 
            $("#completed").empty();
        else
            $("#completed").html("<p>Nenhuma tarefa concluída</p>");
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().description}`);
            var label = $("<label id=" + doc.id + "></label><br/>");

            label.appendTo("#completed");
            var input = $('<input type="checkbox" checked>');
            input.appendTo("#" + doc.id);

            var span = $('<span class="checkbox-material"><span class="check"></span></span>');
            span.appendTo("#" + doc.id);

            label.append(doc.data().description);
        });
    });
})


function addTask(task) {
    db.collection("tasks").add({
        description: task,
        pending: true
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function completeTask(id) {
    var taskRef = db.collection("tasks").doc(id);
    return taskRef.update({
        pending: false
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
    });
}

$("#add_task").on('click', function() {
    var newTask = $("#new_task").val();
    addTask(newTask);
    $("#new_task").val("");
});