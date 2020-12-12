// Declare Variables
var featureExtractor, classifier, video, loss, redCount, blueCount;

// `red` and `blue` are where we're storing the count of how many images we have for each.
redCount = blueCount = 0;


function setup() {
	// Tells p5 to not automatically create a canvas element.
  noCanvas();

	// Starts capturing a video feed from the webcam
  video = createCapture(VIDEO);

	// Puts the video stream into the div in our html, with ID `video`
  video.parent('video'); 

	// Initializes a feature extractor, yet to be trained - from ml5
  featureExtractor = ml5.featureExtractor('MobileNet');
  classifier = featureExtractor.classification(video);

	// Go to line 27
  setupButtons();
}

// A function to add event listeners to buttons
function setupButtons() {

  buttonA = select('#red');
	buttonB = select('#blue');


  buttonA.mousePressed(function() {
		redCount++;
    classifier.addImage('red');
    select('#redCount').html(redCount);
  });

 
  buttonB.mousePressed(function() {
		blueCount++;
    classifier.addImage('blue');
    select('#blueCount').html(blueCount);
  });

  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
			
			// This is where we're actually training our model

      if (lossValue) {
        loss = lossValue;
        select('#info').html('Loss: ' + loss);
      } else {
        select('#info').html('Done Training! Final Loss: ' + loss);
				select('#train').style("display", "none");
				select('#predict').style("display", "inline");
      }
    });
  });

  // Predict Button
  buttonPredict = select('#predict');
  buttonPredict.mousePressed(classify);
}

// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.log(err);
  }
  var answer = Math.max(result[0].confidence, result[1].confidence);
  if(answer == result[0].confidence){
	  select("body").style("background", result[0].label);
  }
  else{
	  select("body").style("background", result[1].label);
  }
  classify();
}