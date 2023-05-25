// AWS Configuration
AWS.config.update({
    accessKeyId: 'AKIAYW2TDMHGVC54UGGG',
    secretAccessKey: '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',
    region: 'ap-south-1'
  });

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: 'initialfacedata'}
});

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const uploadButton = document.getElementById('upload');
const nameInput = document.getElementById('name');
const rollnumberInput = document.getElementById('rollnumber');

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

// function uploadPhoto() {
//     const name = nameInput.value;
//     const rollnumber = rollnumberInput.value;
//     const dataURL = canvas.toDataURL('image/jpeg');
//     const base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, '');

//     const buffer = new Uint8Array(atob(base64Data).split("").map(char => char.charCodeAt(0)));
//     const params = {
//         Key: `${name}-${rollnumber}.jpg`,
//         Body: buffer,
//         ContentType: 'image/jpeg'
//     };

//     s3.upload(params, (err, data) => {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log(data);
//         }
//     });
// }

captureButton.addEventListener('click', capturePhoto);
// uploadButton.addEventListener('click', uploadPhoto);


// alert and navigation
// const uploadButton1 = document.getElementById('upload');

uploadButton.addEventListener('click',() => {
  
  uploadPhoto();
  
    // Display alert message
//   alert('Photo registered successfully!');

//   // Navigate to login page
//   window.location.href = 'http://13.232.104.6:4000/login'; // Replace with the path to your login page
});

function uploadPhoto() {
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
        } else {
            console.log(data);
        }
    });

    alert('Photo registered successfully!');

    setTimeout(() => {
        window.location.href = 'http://13.232.104.6:4000/login'; // Replace with the path to your login page
      }, 1000);
    
}