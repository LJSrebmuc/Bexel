function signOut(){
            firebase.auth().signOut();
            window.location = 'index';
        }
            
$(document).ready(function () { // load the function that moves you on if you already signed in.
    var user;
    var unsub = firebase.auth().onAuthStateChanged(function (user) { // create a listener to waits for firebase initialisation before attempting to get currentUser. 
        user = firebase.auth().currentUser;
        if (!user) { //if logged in, move user to the homepage
            window.location = 'index';
        }
        unsub(); //unsub() here is used to listen on pageload for a user if one is found then move on, if not then stop listening as the return value of unsub() is the function to kill the listener.
        //This is needed as the database connection becomes erratic for other function while listener is active.
    });
});