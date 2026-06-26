// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ─── Canvas Sequence Animation ───────────────────────────
const canvas = document.getElementById("sequence-canvas");
const context = canvas.getContext("2d");

// Match canvas to a high-res output
canvas.width = 1080;
canvas.height = 1920;

const frameCount = 150;
const currentFrame = index => (
  `./hero-image.jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const sequence = { frame: 0 };
let imagesLoaded = 0;

// Preload all images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 1) render(); // Draw the first frame immediately
  };
  images.push(img);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const img = images[Math.round(sequence.frame)];
  if (img && img.complete) {
    // Cover-style drawing: fill the canvas entirely
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (canvas.width - img.width * ratio) / 2;
    const cy = (canvas.height - img.height * ratio) / 2;
    context.drawImage(img, 0, 0, img.width, img.height,
                      cx, cy, img.width * ratio, img.height * ratio);
  }
}

// ─── GSAP ScrollTrigger Setup ────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Main sequence scrubber — scroll controls the frame
gsap.to(sequence, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.15  // Very tight scrub for smooth response
  },
  onUpdate: render
});

// Cinematic slow zoom on the canvas container
gsap.to(".canvas-container", {
  scale: 1.08,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

// ─── Hero Text Animations ────────────────────────────────

// Brand name fades in first (early scroll)
gsap.to(".hero-brand-name", {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "3% top",
    end: "15% top",
    scrub: 1
  }
});

// Tagline follows
gsap.to(".hero-tagline", {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "10% top",
    end: "22% top",
    scrub: 1
  }
});

// CTA button
gsap.to(".hero-cta", {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "18% top",
    end: "28% top",
    scrub: 1
  }
});

// Fade everything out in the second half
gsap.to(".hero-content", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero-sequence",
    start: "55% top",
    end: "75% top",
    scrub: 1
  }
});

// ─── Section Reveal Animations ───────────────────────────

// Welcome images reveal animation
gsap.utils.toArray(".reveal-img").forEach((img, i) => {
  gsap.to(img, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".welcome-section",
      start: "top 70%",
    },
    delay: i * 0.2
  });
});

// Core values reveal
gsap.from(".value-card", {
  opacity: 0,
  y: 50,
  duration: 0.8,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".core-values-section",
    start: "top 70%"
  }
});

// Testimonial reveal
gsap.from(".testimonial", {
  opacity: 0,
  scale: 0.9,
  duration: 0.8,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".testimonials-section",
    start: "top 70%"
  }
});

// Contact section reveal
gsap.from(".contact-form", {
  opacity: 0,
  x: -50,
  duration: 1,
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top 75%"
  }
});

gsap.from(".contact-info-map", {
  opacity: 0,
  x: 50,
  duration: 1,
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top 75%"
  }
});
