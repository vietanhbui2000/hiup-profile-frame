// script.js
document.addEventListener('DOMContentLoaded', () => {
	const imageInput = document.getElementById('imageInput');
	const applyFrameBtn = document.getElementById('applyFrameBtn');
	const outputCanvas = document.getElementById('outputCanvas');
	const canvasContext = outputCanvas.getContext('2d');
	const frameImage = new Image();
	const FRAME_PATH = 'frame.png';

	frameImage.onload = () => {
		applyFrameBtn.disabled = false;
	};
	frameImage.onerror = () => {
		console.error('Error loading frame image.');
	};
	frameImage.src = FRAME_PATH;

	imageInput.addEventListener('change', async (event) => {
		try {
			const uploadedImage = event.target.files[0];
			if (uploadedImage && uploadedImage.type.startsWith('image/')) {
				const imageDataUrl = await loadImageData(uploadedImage);
				drawImageOnCanvas(imageDataUrl);
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
		if (frameImage.complete) {
			canvasContext.drawImage(frameImage, 0, 0, 1080, 1080);
			const outputDataURL = outputCanvas.toDataURL('image/jpeg');
			downloadImage(outputDataURL, 'hiup_fr-pp.jpg');
		}
	}

	function downloadImage(dataUrl, fileName) {
		const downloadLink = document.createElement('a');
		downloadLink.href = dataUrl;
		downloadLink.download = fileName;
		downloadLink.click();
	}
});