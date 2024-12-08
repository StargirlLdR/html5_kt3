const audioPlayer = document.getElementById('audioPlayer');
const audioVolume = document.getElementById('audioVolume');
const audioSeek = document.getElementById('audioSeek');

document.getElementById('playAudio').addEventListener('click', () => audioPlayer.play());
document.getElementById('pauseAudio').addEventListener('click', () => audioPlayer.pause());
audioVolume.addEventListener('input', () => audioPlayer.volume = audioVolume.value);
audioPlayer.addEventListener('loadedmetadata', () => {
    audioSeek.max = Math.floor(audioPlayer.duration);
});
audioSeek.addEventListener('input', () => audioPlayer.currentTime = audioSeek.value);
audioPlayer.addEventListener('timeupdate', () => {
    audioSeek.value = Math.floor(audioPlayer.currentTime);
});

const videoPlayer = document.getElementById('videoPlayer');
const videoVolume = document.getElementById('videoVolume');
const videoSeek = document.getElementById('videoSeek');

document.getElementById('playVideo').addEventListener('click', () => videoPlayer.play());
document.getElementById('pauseVideo').addEventListener('click', () => videoPlayer.pause());
videoVolume.addEventListener('input', () => videoPlayer.volume = videoVolume.value);
videoPlayer.addEventListener('loadedmetadata', () => {
    videoSeek.max = Math.floor(videoPlayer.duration);
});
videoSeek.addEventListener('input', () => videoPlayer.currentTime = videoSeek.value);
videoPlayer.addEventListener('timeupdate', () => {
    videoSeek.value = Math.floor(videoPlayer.currentTime);
});




const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'blue', 
    dx: 2,
    dy: 3,
};

const speedControl = document.getElementById('speed');

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    updateBallPosition();
    requestAnimationFrame(animate);
}

speedControl.addEventListener('input', (event) => {
    const speed = parseInt(event.target.value, 10);
    ball.dx = ball.dy = speed / 2; 
});

animate();





const imageCanvas = document.getElementById('imageCanvas');
const imageCtx = imageCanvas.getContext('2d');
const uploadImage = document.getElementById('uploadImage');
const resizeWidthInput = document.getElementById('resizeWidth');
const resizeHeightInput = document.getElementById('resizeHeight');
const resizeButton = document.getElementById('resizeImage');
const invertCheckbox = document.getElementById('invertColors');
const saveButton = document.getElementById('saveImage');

let img = new Image(); 
let originalWidth, originalHeight; 

uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;

            img.onload = () => {
                originalWidth = img.width;
                originalHeight = img.height;
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;

                imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
                imageCtx.drawImage(img, 0, 0);
                resizeWidthInput.value = img.width;
                resizeHeightInput.value = img.height;
            };
        };

        reader.readAsDataURL(file);
    }
});

resizeButton.addEventListener('click', () => {
    const newWidth = parseInt(resizeWidthInput.value);
    const newHeight = parseInt(resizeHeightInput.value);

    imageCanvas.width = newWidth;
    imageCanvas.height = newHeight;

    imageCtx.clearRect(0, 0, newWidth, newHeight);
    imageCtx.drawImage(img, 0, 0, newWidth, newHeight);

    if (invertCheckbox.checked) {
        applyInvertFilter();
    }
});

invertCheckbox.addEventListener('change', () => {
    if (invertCheckbox.checked) {
        applyInvertFilter();
    } else {
        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
    }
});

function applyInvertFilter() {
    let imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; 
        data[i + 1] = 255 - data[i + 1]; 
        data[i + 2] = 255 - data[i + 2]; 
    }

    imageCtx.putImageData(imageData, 0, 0);
}

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = imageCanvas.toDataURL();
    link.click();
});