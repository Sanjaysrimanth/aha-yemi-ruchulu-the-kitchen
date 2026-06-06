document.addEventListener("DOMContentLoaded", () => {
    // Scoped to avoid selecting items outside the restaurant hero element
    const heroContainer = document.querySelector(".rfh-hero-wrapper");
    const titleLetters = heroContainer.querySelectorAll(".rfh-giant-title span");
    const foodShowcase = heroContainer.querySelector(".rfh-food-showcase");
  
    let mouseX = 0;
    let mouseY = 0;
  
    // Track dynamic mouse positions inside hero zone
    heroContainer.addEventListener("mousemove", (e) => {
      const rect = heroContainer.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
  
      // Apply fluid, dynamic blur to text characters based on distance from the mouse pointer
      titleLetters.forEach((letter) => {
        const letterRect = letter.getBoundingClientRect();
        const letterX = letterRect.left + letterRect.width / 2 - rect.left;
        const letterY = letterRect.top + letterRect.height / 2 - rect.top;
  
        // Calculate distance between mouse and each individual letter
        const distance = Math.hypot(mouseX - letterX, mouseY - letterY);
  
        // Trigger effect if mouse gets close (e.g., within 220 pixels)
        if (distance < 220) {
          // Closer coordinates create stronger blurs
          const intensity = (1 - distance / 220);
          const blurAmount = intensity * 14; // Max blur 14px
          const scaleAmount = 1 + intensity * 0.08; // Mild visual scale bulge
  
          letter.style.filter = `blur(${blurAmount}px)`;
          letter.style.transform = `scale(${scaleAmount})`;
        } else {
          // Reset styles cleanly if out of boundary lines
          letter.style.filter = "blur(0px)";
          letter.style.transform = "scale(1)";
        }
      });
    });
  
    // Smooth mouse-tilt interaction on the Food Image itself
    foodShowcase.addEventListener("mousemove", (e) => {
      const width = foodShowcase.clientWidth;
      const height = foodShowcase.clientHeight;
      
      const rect = foodShowcase.getBoundingClientRect();
      const localX = e.clientX - rect.left - width / 2;
      const localY = e.clientY - rect.top - height / 2;
  
      // Calculate subtilties ratios
      const tiltX = (localY / (height / 2)) * -12; // max tilt 12 degrees
      const tiltY = (localX / (width / 2)) * 12;
  
      const img = foodShowcase.querySelector(".rfh-food-image");
      img.style.transform = `scale(1.06) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  
    // Re-initialize uniform clean state when pointer leaves the region
    heroContainer.addEventListener("mouseleave", () => {
      titleLetters.forEach((letter) => {
        letter.style.filter = "blur(0px)";
        letter.style.transform = "scale(1)";
      });
      
      const img = foodShowcase.querySelector(".rfh-food-image");
      img.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
    });
  });


  