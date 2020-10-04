            var fname,uname,lname,email;
            var uId;
            function logOut() {
                firebase.auth().signOut();
                window.location = 'index';
            }
            $(document).ready(function () { // load the function that moves you on if you already signed in.
                var user;
                var unsub = firebase.auth().onAuthStateChanged(function (user) { // create a listener to wait for firebase initialisation before attempting to get currentUser 
                    user = firebase.auth().currentUser;
                    if (!user) { //if logged in, move user to the homepage
                        window.location = 'index';
                    }
                    else {
                        uId = firebase.auth().currentUser.uid;
                        var userRef = firebase.database().ref('/users/' + uId).on("value", function (snap) { //pull a snapshot of the database from firebase
                            fname = snap.val().firstName;
                            lname = snap.val().lastName;
                            uname = snap.val().username;
                            email = snap.val().email;
                            document.getElementById("fname").placeholder = fname;
                            document.getElementById("lname").placeholder = lname;
                            document.getElementById("email").placeholder = email;
                            document.getElementById("uname").placeholder = uname;
                        });
                    }
                    unsub(); //unsub() here is used to listen on pageload for a user if one is found then move on, if not then stop listening as the return value of unsub() is the function to kill the listener.
                    //This is needed as the database connection becomes erratic for other function while listener is active.
                });
            });

            function writeNewPost() {
                console.log("Haii");
                var x = document.forms["changeDetails"]["fname"].value;
                var y = document.forms["changeDetails"]["lname"].value;
                var z = document.forms["changeDetails"]["uname"].value;
                var w = document.forms["changeDetails"]["email"].value;
                 console.log(fname);
                
                if(x!=""){
                    fname = x;
                }
                if(y!=""){
                    lname = y;
                }
                if(z!=""){
                    uname = z;
                }
                 if(w!=""){
                    email = w;
                }
                
                // A post entry.
                var updates = {
                    username: uname
                    , firstName: fname
                    , lastName: lname
                    , email: email
                };
                // Get a key for a new Post.
                var userRef = firebase.database().ref("users");
                userRef.child(uId).update(updates);
                return false;
            }