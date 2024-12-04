// Get modal elements
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-image");
const closeModal = document.getElementsByClassName("close")[0];
let currentZoom = 1;
let isPanning = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let originX = 0;
let originY = 0;

// Disable drag behavior on the modal image
modalImg.ondragstart = function() { return false; };

// Open modal when image is clicked
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.style.transform = "translate(0px, 0px) scale(1)";
        currentZoom = 1; // Reset zoom on opening modal
        translateX = 0;  // Reset panning position
        translateY = 0;
    };
});

// Close modal when close button or outside the image is clicked
closeModal.onclick = function () {
    modal.style.display = "none";
    resetZoom();
};
modal.onclick = function (e) {
    if (e.target !== modalImg) {
        modal.style.display = "none";
        resetZoom();
    }
};

// Zoom in/out on scroll (relative to the page, not the image)
modal.addEventListener('wheel', function (e) {
    e.preventDefault();

    const rect = modalImg.getBoundingClientRect();

    // Calculate the mouse position relative to the entire page (not the image)
    const offsetX = e.pageX;
    const offsetY = e.pageY;

    const zoomFactor = 0.1; // Adjust zoom speed
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;

    const newZoom = Math.min(Math.max(1, currentZoom + delta), 5); // Min zoom is 1, max is 5
    const zoomRatio = newZoom / currentZoom;

    currentZoom = newZoom;
    modalImg.style.transform = `scale(${currentZoom})`;
});

// Start panning (dragging) when mouse is pressed down
modalImg.addEventListener('mousedown', function (e) {
    if (currentZoom > 1) {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.cursor = "grabbing";
    }
});

// Handle panning on mouse move, tracked on the document to avoid issues
document.addEventListener('mousemove', function (e) {
    if (!isPanning) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    // Apply boundaries based on the zoom level and image size
    const rect = modalImg.getBoundingClientRect();
    const maxTranslateX = (rect.width * currentZoom - rect.width) / 2;
    const maxTranslateY = (rect.height * currentZoom - rect.height) / 2;

    // Constrain translation to prevent dragging outside the bounds of the image
    translateX = Math.min(maxTranslateX, Math.max(-maxTranslateX, translateX));
    translateY = Math.min(maxTranslateY, Math.max(-maxTranslateY, translateY));

    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
});

// Stop panning when mouse is released
document.addEventListener('mouseup', function () {
    isPanning = false;
    modalImg.style.cursor = "grab";
});

// Reset zoom and panning
function resetZoom() {
    translateX = 0;
    translateY = 0;
    currentZoom = 1;
    modalImg.style.transform = "translate(0px, 0px) scale(1)";
}
