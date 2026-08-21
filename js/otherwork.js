// Select all .other-work-image-box elements
const imageBoxes = document.querySelectorAll('.other-work-image-box');

// Define the background images
const backgroundImages = [
    'images/Blender/fullroom1.png', // Background for the first image
    'images/Photoshop/photoshop.png', // Background for the second image
    'images/Code/code.png' // Background for the third image
];

// Apply the background images dynamically
imageBoxes.forEach((box, index) => {
    if (backgroundImages[index]) {
        box.style.backgroundImage = `url('${backgroundImages[index]}')`;
        box.style.backgroundSize = 'cover'; // Ensures the image covers the entire box
        box.style.backgroundPosition = 'center'; // Centers the image
    }
});
