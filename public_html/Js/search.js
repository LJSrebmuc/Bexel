  var map,chromeLat,chromeLon,locEnable;
    var Latlng = new google.maps.LatLng(70.38914, -6.600050); //Default Location
    var classRef = firebase.database().ref('classes');
    var mapRefreshed = false;

    function initialise() {
        var mapOptions = {
            zoom: 11,
            center: Latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions); //Create new map

        var isChromium = window.chrome,
            winNav = window.navigator,
            vendorName = winNav.vendor,
            isIEedge = winNav.userAgent.indexOf("Edge") > -1;
        
        if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isIEedge == false){
            if(!mapRefreshed){
                locEnable = confirm("Would you like to share your location with this site?");
            }
            if(locEnable){
                $.getJSON("http://ip-api.com/json", function(json) {
                    chromeLat = json.lat;
                    chromeLon = json.lon;
                    initialLocation = new google.maps.LatLng(chromeLat,chromeLon);
                    map.setCenter(initialLocation);
                });
            }
            else{ alert("Some functionalities may not work properly without your location. To continue, refresh this page and accept location services");}
        }
        else if (navigator.geolocation) { //if location allowed
                    navigator.geolocation.getCurrentPosition(function(position) {
                        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Get User location using GeoLocation API
                    map.setCenter(initialLocation); // Refresh map to centre on user location
                    });
            
        }
        
        if (mapRefreshed) { //if the user has searched for something

            var searchString = $("#search").val(); //pulls search term from the HTML page
            classRef.orderByChild("ClassTitle").equalTo(searchString).on("value", function(snap) { //pull a snapshot of the database from firebase
                snap.forEach(function(item) {
                    var contentString = "<h2>" + item.val().ClassTitle + "</h2>\n" + item.val().ClassDescription + "\n<h4>Instructor: </h4>" + item.val().ClassInstructor + "\n<h4>Email:  </h4>" + item.val().Email + "\n<h4>Facebook: </h4>" + item.val().Facebook + "\n<h4>Twitter: </h4>" + item.val().Twitter + "\n<h4>Phone: </h4>" + item.val().Phone + "\n<h4>Website: </h4>" + item.val().Website; //set the content string for this title

                    var ClassLoc = new google.maps.LatLng(item.val().LocationLat, item.val().LocationLong); //set the location for this title
                    var marker = new google.maps.Marker({ //place the marker for this title
                        position: ClassLoc,
                        map: map
                    });

                    var infowindow = new google.maps.InfoWindow(); //create a new infowindow
                    google.maps.event.addListener(marker, 'click', (function(marker, contentString, infowindow) { //listener for the markers/infowindows
                        return function() {
                            infowindow.setContent(contentString);
                            infowindow.open(map, marker);
                        };
                    })(marker, contentString, infowindow));

                });

            });
            mapRefreshed = false; //resets the tracker for searches to allow for multiple searches on the map
        }

    }

    document.getElementById("searchBox").onsubmit = function(search) {
        search.preventDefault(); //prevent normal HTML form submit
        mapRefreshed = true; //set search tracking variable to true to indicate a search has happened
        initialise(); //refresh map to place markers
    }
    
  $(document).ready(function () { // load the function that moves you on if you already signed in.
              var user;
              var unsub = firebase.auth().onAuthStateChanged(function (user) { // create a listener to wait for firebase initialisation before attempting to get currentUser 
                  user = firebase.auth().currentUser;
                  if (user) { //if logged in, move user to the homepage
                      initialise();
                  }
                  else{
                      window.location = 'index';
                  }
            unsub(); //unsub() here is used to listen on pageload for a user if one is found then move on, if not then stop listening as the return value of unsub() is the function to kill the listener.
        //This is needed as the database connection becomes erratic for other function while listener is active.
    });


});
