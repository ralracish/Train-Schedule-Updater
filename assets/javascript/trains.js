// 1. Initialize Firebase

var config = {
  apiKey: "AIzaSyApj1TcasTsIS2SWx4hlOJAEzkehmvn3DM",
  authDomain: "train-scheduler-6c121.firebaseapp.com",
  databaseURL: "https://train-scheduler-6c121.firebaseio.com",
  projectId: "train-scheduler-6c121",
  storageBucket: "train-scheduler-6c121.appspot.com",
  messagingSenderId: "599783446938"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Add Button for adding trains

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

// 3. Grab user input

var trainName = $("#add-train-input").val().trim();
var destination = $("#destination-input").val().trim();
var firstTrainTime = $("#first-train-input").val().trim();
var frequency = $("#frequency-input").val().trim();
  
// 4. Create object for train data
var trainsData = {
  trainName: trainName,
  destination: destination,
  firstTrainTime: firstTrainTime,
  frequency: frequency,
};

// 5. Input validation

if (trainName === "" || destination === "" || firstTrainTime === "" || frequency === "") {
  $("#alert").addClass("show")

}
else {
  $("#alert").addClass("hide")

// 6. Uploads trains data to the database

database.ref().push(trainsData);

// 7. Clears all of the text boxes
$("add-train-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#frequency-input").val("");
}
})

// 8. Create Firebase event for adding train information to database and row in html when user adds an entry 
setInterval(function () {
  $("#train-table > tbody").empty();
  database.ref().on("child_added", function (childSnapshot) {
    var databaseData = childSnapshot.val();


// 9. Calculate next arrival time and minutes away
    var convertedFirstTrain = moment(databaseData.firstTrainTime, "HH:mm").subtract(1, "years");

    var difference = moment().diff(moment(convertedFirstTrain), "minutes");

    var timeRemaining = difference % databaseData.frequency;

    var minutesAway = databaseData.frequency - timeRemaining;

    var nextArrival = moment(convertedFirstTrain).add(minutesAway, "minutes");
    nextArrival=moment(nextArrival).format("HH:mm")

// 10. Append the new row to the table
    var newRow = $("<tr>").append(
      $("<td>").text(databaseData.trainName),
      $("<td>").text(databaseData.destination),
      $("<td>").text(databaseData.frequency),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway)
    );
    $("#train-table > tbody").append(newRow);

  });
}, 1000)