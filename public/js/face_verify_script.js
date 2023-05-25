AWS.config.update({
    accessKeyId: 'AKIAYW2TDMHGVC54UGGG',
    secretAccessKey: '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',
    region: 'ap-south-1'
  });
  
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'checkfacedata' }
  });
  
  const lambda = new AWS.Lambda({
    region: 'ap-south-1'
  });
  
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureButton = document.getElementById('capture');
  const uploadButton = document.getElementById('upload');
  const nameInput = document.getElementById('name');
  const rollnumberInput = document.getElementById('rollnumber');
  const messageContainer = document.getElementById('message');
  
  const constraints = {
    video: true
  };
  
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
  
  function capturePhoto() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  
  captureButton.addEventListener('click', capturePhoto);
  
  uploadButton.addEventListener('click', () => {
    const name = nameInput.value;
    const rollnumber = rollnumberInput.value;
    const dataURL = canvas.toDataURL('image/jpeg');
    const base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, '');
  
    const buffer = new Uint8Array(atob(base64Data).split("").map(char => char.charCodeAt(0)));
    const params = {
      Key: `${name}-${rollnumber}.jpg`,
      Body: buffer,
      ContentType: 'image/jpeg'
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        displayMessage('An error occurred. Please try again.');
      } else {
        console.log(data);
        const imageUrl = data.Location;
        callLambdaFunction(imageUrl);
      }
    });
  });
  
  function callLambdaFunction(imageUrl) {
    const payload = {
      imageUrl: imageUrl
    };
  
    const params = {
      FunctionName: 'checkfacedata',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(payload)
    };
  
    lambda.invoke(params, (err, data) => {
      if (err) {
        console.error(err);
        displayMessage('An error occurred. Please try again.');
      } else {
        console.log(data);
        const response = JSON.parse(data.Payload);
        if (response.statusCode === 200) {
          displayMessage('Success! Photo registered.');
          setTimeout(() => {
            window.location.href = 'http://13.232.104.6:4000/verify';
          }, 1000);
        } else {
          displayMessage('Registration failed. Please try again.');
        }
      }
    });
  }
  
  function displayMessage(message) {
    messageContainer.textContent = message;
  }
  