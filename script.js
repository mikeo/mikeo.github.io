// Get modal elements
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-image");
const closeModal = document.getElementsByClassName("close")[0];
let currentZoom = 1;
let isPanning = false;
let startX = 0;
let startY = 0;
let scrollLeft = 0;
let scrollTop = 0;

// Gallery images click event
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        currentZoom = 1;
        resetZoom();
    });
});

// Close modal on click outside of image or on 'X'
modal.addEventListener('click', function (event) {
    if (event.target !== modalImg) {
        modal.style.display = "none";
        resetZoom();
    }
});

// Close modal on 'X' click
closeModal.onclick = function() {
    modal.style.display = "none";
    resetZoom();
}

// Zoom on scroll
modalImg.addEventListener('wheel', function (event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        currentZoom += 0.1;
    } else if (event.deltaY > 0 && currentZoom > 1) {
        currentZoom -= 0.1;
    }
    modalImg.style.transform = `scale(${currentZoom})`;
});

// Panning functionality
modalImg.addEventListener('mousedown', (e) => {
    if (currentZoom > 1) {
        isPanning = true;
        startX = e.pageX - modalImg.offsetLeft;
        startY = e.pageY - modalImg.offsetTop;
        scrollLeft = modal.scrollLeft;
        scrollTop = modal.scrollTop;
        modalImg.style.cursor = 'grabbing';
    }
});

modalImg.addEventListener('mouseup', () => {
    isPanning = false;
    modalImg.style.cursor = 'grab';
});

modalImg.addEventListener('mouseleave', () => {
    isPanning = false;
});

modalImg.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const x = e.pageX - modalImg.offsetLeft;
    const y = e.pageY - modalImg.offsetTop;
    const walkX = (x - startX) * 2; // Adjust scrolling speed
    const walkY = (y - startY) * 2; // Adjust scrolling speed
    modal.scrollLeft = scrollLeft - walkX;
    modal.scrollTop = scrollTop - walkY;
});

// Reset zoom level
function resetZoom() {
    currentZoom = 1;
    modalImg.style.transform = `scale(${currentZoom})`;
    modalImg.style.cursor = 'grab';
    modal.scrollLeft = 0;
    modal.scrollTop = 0;
}
