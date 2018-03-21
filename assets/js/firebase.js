var config = {
    apiKey: "AIzaSyDB19i105wUSqoGlxLdIi2s8a0aRDEb9UA",
    authDomain: "workshop-firebase-web.firebaseapp.com",
    databaseURL: "https://workshop-firebase-web.firebaseio.com",
    projectId: "workshop-firebase-web",
    storageBucket: "",
    messagingSenderId: "523334017959"
};
firebase.initializeApp(config);

firebase.auth().useDeviceLanguage();

var googleProvider = new firebase.auth.GoogleAuthProvider();
var facebookProvder = new firebase.auth.FacebookAuthProvider();
var twitterProvider = new firebase.auth.TwitterAuthProvider();

firebase.auth()
    .onAuthStateChanged(function(user) {
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