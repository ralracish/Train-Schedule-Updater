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

  // 5. Uploads trains data to the database
  database.ref().push(trainsData);

  // 6. Clears all of the text boxes
  $("add-train-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
})

// 7. Create Firebase event for adding train information to database and row in html when user adds an entry 
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());

  // 8. Store everything added to form into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;


  // 9. Calculate next arrival time and minutes away
  var convertedFirstTrain = moment(firstTrainTime, "HH:mm").subtract(1, "years");
   console.log(convertedFirstTrain);

  var difference = moment(firstTrainTime, "HH:mm").diff(moment(convertedFirstTrain), "minutes");
   console.log("Difference in time: " + difference)

  var timeRemaining = difference % frequency;
   console.log(frequency)
   console.log("Time remaining " + timeRemaining);

  var minutesAway = frequency - timeRemaining;
    console.log("Minutes til train: " + minutesAway);

  var nextArrival = moment(convertedFirstTrain).add(minutesAway, "minutes");
    nextArrival=moment(nextArrival).format("HH:mm")
    console.log(nextArrival)

  // 10. Append the new row to the table
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesAway)
  );
  $("#train-table > tbody").append(newRow);

});