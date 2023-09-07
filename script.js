// script.js
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const applyFrameBtn = document.getElementById('applyFrameBtn');
    const frameSelect = document.getElementById('frameSelect');
    const outputCanvas = document.getElementById('outputCanvas');
    const canvasContext = outputCanvas.getContext('2d');
    const FRAME_PATHS = {
        'concaometuhao.png': 'concaometuhao.png',
        'nuoiem.png': 'nuoiem.png',
        // Add more frame paths as needed
    };

    let originalImageDataUrl = null;

    // Function to load the default frame (concaometuhao.png)
    loadFrame('concaometuhao.png');

    // Function to load the selected frame
    function loadFrame(framePath) {
        const frameImage = new Image();
        frameImage.onload = () => {
            applyFrameBtn.disabled = false;
        };
        frameImage.onerror = () => {
            console.error('Error loading frame image.');
        };
        frameImage.src = FRAME_PATHS[framePath];
    }

    // Event listener for frame selection
    frameSelect.addEventListener('change', () => {
        const selectedFrame = frameSelect.value;
        loadFrame(selectedFrame);
        // Clear the canvas and redraw the original image when a new frame is selected
        clearCanvas();
        if (originalImageDataUrl) {
            drawImageOnCanvas(originalImageDataUrl);
        }
    });

    imageInput.addEventListener('change', async (event) => {
        try {
            const uploadedImage = event.target.files[0];
            if (uploadedImage && uploadedImage.type.startsWith('image/')) {
                originalImageDataUrl = await loadImageData(uploadedImage);
                // Clear the canvas and draw the original image
                clearCanvas();
                drawImageOnCanvas(originalImageDataUrl);
            } else {
                console.error('Invalid image file.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    });

    applyFrameBtn.addEventListener('click', () => {
        drawFrameOnCanvas();
    });

    function loadImageData(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    function clearCanvas() {
        canvasContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    }

    function drawImageOnCanvas(imageDataUrl) {
        const image = new Image();
        image.src = imageDataUrl;
        image.onload = () => {
            outputCanvas.width = 1080;
            outputCanvas.height = 1080;
            const imageAspectRatio = image.width / image.height;
            const targetSize = Math.min(image.width, image.height);
            const sourceX = (image.width - targetSize) / 2;
            const sourceY = (image.height - targetSize) / 2;
            canvasContext.drawImage(image, sourceX, sourceY, targetSize, targetSize, 0, 0, 1080, 1080);
            outputCanvas.style.display = 'block';
        };
        image.onerror = () => {
            console.error('Error loading image.');
        };
    }

    function drawFrameOnCanvas() {
        const selectedFrame = frameSelect.value;
        const frameImage = new Image();
        frameImage.onload = () => {
            canvasContext.drawImage(frameImage, 0, 0, 1080, 1080);
            const outputDataURL = outputCanvas.toDataURL('image/jpeg');
            downloadImage(outputDataURL, 'hiup_fr-pp.jpg');
        };
        frameImage.onerror = () => {
            console.error('Error loading frame image.');
        };
        frameImage.src = FRAME_PATHS[selectedFrame];
    }

    function downloadImage(dataUrl, fileName) {
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = fileName;
        downloadLink.click();
    }
});