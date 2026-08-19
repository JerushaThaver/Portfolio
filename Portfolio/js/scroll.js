document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with slide-in, slide-out, fade-in, or slide-up classes
    const animatedElements = document.querySelectorAll(".slide-in, .slide-out, .fade-in, .slide-up");

    function handleScroll() {
        animatedElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            // Check if the element is visible in the viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on page load in case elements are already in view
});
