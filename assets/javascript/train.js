
  // Your web app's Firebase configuration

  var firebaseConfig = {
    apiKey: "AIzaSyB_Z9KMvTFK5tHiaZQmj0dgGwrMUILdskw",
    authDomain: "aj-trainscheduler.firebaseapp.com",
    databaseURL: "https://aj-trainscheduler.firebaseio.com",
    projectId: "aj-trainscheduler",
    storageBucket: "aj-trainscheduler.appspot.com",
    messagingSenderId: "314880381766",
    appId: "1:314880381766:web:43ef77ef9c297e051dcb47"
  };

  // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

$("#submit-button").on("click", function (event) {
    event.preventDefault();

    var name = $("#train-name").val().trim();
    var destination = $("#train-destination").val().trim();
    var frequency = $("#train-frequency").val().trim();
    var firstArrival = $("#train-time").val().trim();
    


    console.log(name);
    console.log(destination);
    console.log(frequency);
    console.log(firstArrival);

    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        arrival: firstArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

database.ref().orderByChild("dateAdded").on("child_added", function (response) {

    $("#train-name").val('')
    $("#train-destination").val('')
    $("#train-frequency").val('')
    $("#train-time").val('')

    var tr = $("<tr>")
    var convertedFirstTime = moment(response.val().arrival, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertedFirstTime), "minutes")
    var remainder = diffTime % response.val().frequency;
    var minUntil = response.val().frequency - remainder;
    console.log(remainder);
    console.log(minUntil);
    console.log(response.val())

    $("tbody").append(tr)

    $(tr).append("<td>" + response.val().name + "</td>");
    $(tr).append("<td>" + response.val().destination + "</td>");
    $(tr).append("<td>" + response.val().frequency + "</td>");
    $(tr).append("<td>" + moment().add(minUntil, "minutes").format("hh:mm a") + "</td>");
    
    $(tr).append("<td>" + minUntil + "</td>");

    

});

setInterval(function getInfo() {

    $("tbody").empty();

    database.ref().orderByChild("dateAdded").on("child_added", function (response) {
        var tr = $("<tr>")
        var convertedFirstTime = moment(response.val().arrival, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(convertedFirstTime), "minutes")
        var remainder = diffTime % response.val().frequency;
        var minUntil = response.val().frequency - remainder;
        console.log(remainder);
        console.log(minUntil);
        console.log(response.val())

        $("tbody").append(tr)

        $(tr).append("<td>" + response.val().name + "</td>");
        $(tr).append("<td>" + response.val().destination + "</td>");
        $(tr).append("<td>" + response.val().frequency + "</td>");
        $(tr).append("<td>" + moment().add(minUntil, "minutes").format("hh:mm a") + "</td>");
        //Need to actually convert frequency to next arrival time.
        $(tr).append("<td>" + minUntil + "</td>");
    })

}, 60 * 1000);