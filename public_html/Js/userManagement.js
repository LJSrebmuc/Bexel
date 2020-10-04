var getUserName, getFirstName, getLastName;


function getUserData() {

    var database = firebase.database();
    var uId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uId).once('value').then(function (snapshot) { //WILL NOT WORK SDJKFNDFZILGUKJAnsdrgILKUJGFDHDCVBHNSFTGHADFGSDFG
        //nevermind im a god still requires reformatting for practical uses

        getUserName = snapshot.val().username;
        getFirstName = snapshot.val().firstName;
        getLastName = snapshot.val().lastName;
   //     alert(uId);//debug code
      // alert(getUserName);//debug code
      //  alert(firstName);//debug code
        //alert(lastName);//debug code
        
    });
 alert(getUserName);//cant get varibles outside of function
}
