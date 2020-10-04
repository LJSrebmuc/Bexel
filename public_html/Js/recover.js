function sendEmail() {

    var auth = firebase.auth();
    var emailAddress = document.getElementById('recoverEmail').value;;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        $("#sentModal").modal()
    }, function (error) {
        // An error happened.
    });


}
