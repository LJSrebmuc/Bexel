function signUp() { //this function handles the sign up with the auth server as well as error handling and detail insertion
    email = document.getElementById('suemail').value;
    password = document.getElementById('supassword').value;
    userName = document.getElementById('suusername').value;
    firstName = document.getElementById('sufirstname').value;
    lastName = document.getElementById('sulastname').value; //declare and pull data from html form
    newAcc = 1;

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a longer password.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (uId) { // firebase funtion to create a user with attached .then() to ensure correct asynchronous execution
        var uId = firebase.auth().currentUser.uid; // the UserId for the newly created user is then stored to be used for object creation.
        saveDetails(userName, firstName, lastName, email, uId); // is called to save extra user data to database.


    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorMessage);
        console.log(error);
    });

}

function logIn() { //this function handles login and error handling
    var email = " ";
    var password = " ";
    email = document.getElementById('logEmail').value;
    password = document.getElementById('logPass').value; //declare and pull data from html form.

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 1) {
        alert('Please enter a password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) { // firebase function for sign in, includes error handling.
        //Also, had attacted .then() to ensure correct asynchronous execution of signIn and redirect.
        window.location = "home";

    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }

        console.log(error); //log the errors for debugging.
    });
}

function saveDetails(user, first, last, email, uId) { //takes the user detaisl as input then puts them into the "users" object in the database
    var database = firebase.database(); // establish database connection.

    firebase.database().ref('users/' + uId).set({ // creats new objects in the database with the name = their userid and values as follows, formatted for JSON.
        "username": user,
        "firstName": first,
        "lastName": last,
        "email": email
    }).then(function (user) {

        window.location = "home"; // after insertion completion is ensured by callback .then() , move the user to the homepage. 

    });

}
$(document).ready(function () { // load the function that moves you on if you already signed in.
    var user;
    var unsub = firebase.auth().onAuthStateChanged(function (user) { // create a listener to waits for firebase initialisation before attempting to get currentUser. 
        user = firebase.auth().currentUser;
        if (user) { //if logged in, move user to the homepage
            window.location = 'home';
        }
        unsub(); //unsub() here is used to listen on pageload for a user if one is found then move on, if not then stop listening as the return value of unsub() is the function to kill the listener.
        //This is needed as the database connection becomes erratic for other function while listener is active.
    });


});

//---------------------------------------------jQuery----------------------------------------------//

$(function () { // jQuery function to dynamically display the login and register panels

    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active2');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active2');
        e.preventDefault();
    });

});
