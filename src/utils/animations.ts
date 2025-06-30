import anime from 'animejs/lib/anime.es.js';

// Utility functions for Anime.js animations
export const animeUtils = {
  // Fade in animation
  fadeIn: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad',
      ...options
    });
  },

  // Slide in from bottom
  slideInUp: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutCubic',
      ...options
    });
  },

  // Slide in from left
  slideInLeft: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateX: [-50, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutCubic',
      ...options
    });
  },

  // Slide in from right
  slideInRight: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateX: [50, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutCubic',
      ...options
    });
  },

  // Scale animation
  scaleIn: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutBack',
      ...options
    });
  },

  // Stagger animation for multiple elements
  staggerIn: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      ...options
    });
  },

  // Floating animation
  float: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateY: [-10, 10],
      duration: 2000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      ...options
    });
  },

  // Pulse animation
  pulse: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      scale: [1, 1.05, 1],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad',
      ...options
    });
  },

  // Glow animation
  glow: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      boxShadow: [
        '0 0 20px rgba(139, 69, 255, 0.3)',
        '0 0 40px rgba(139, 69, 255, 0.6)',
        '0 0 20px rgba(139, 69, 255, 0.3)'
      ],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuad',
      ...options
    });
  },

  // Rotate animation
  rotate: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      rotate: '1turn',
      duration: 2000,
      easing: 'linear',
      ...options
    });
  },

  // Bounce animation
  bounce: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateY: [0, -20, 0],
      duration: 600,
      easing: 'easeOutBounce',
      ...options
    });
  },

  // Text reveal animation
  textReveal: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(50),
      easing: 'easeOutQuad',
      ...options
    });
  },

  // Progress bar animation
  progressBar: (targets: string | Element | NodeList, width: string, options: any = {}) => {
    return anime({
      targets,
      width: [0, width],
      duration: 1000,
      easing: 'easeOutQuad',
      ...options
    });
  },

  // Card flip animation
  cardFlip: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      rotateY: [0, 180],
      duration: 600,
      easing: 'easeInOutQuad',
      ...options
    });
  },

  // Morphing animation
  morph: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      borderRadius: ['0%', '50%', '0%'],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuad',
      ...options
    });
  },

  // Timeline for complex animations
  createTimeline: (options: any = {}) => {
    return anime.timeline({
      easing: 'easeOutExpo',
      duration: 750,
      ...options
    });
  },

  // Particle animation
  particles: (targets: string | Element | NodeList, options: any = {}) => {
    return anime({
      targets,
      translateX: () => anime.random(-100, 100),
      translateY: () => anime.random(-100, 100),
      scale: () => anime.random(0.5, 1.5),
      opacity: [1, 0],
      duration: () => anime.random(1000, 3000),
      delay: () => anime.random(0, 1000),
      loop: true,
      easing: 'linear',
      ...options
    });
  }
};

// Predefined animation sequences
export const animationSequences = {
  // Page entrance animation
  pageEntrance: (container: string | Element) => {
    const tl = animeUtils.createTimeline();
    
    tl.add({
      targets: `${container} .animate-header`,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 800
    })
    .add({
      targets: `${container} .animate-content`,
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 600
    }, '-=400')
    .add({
      targets: `${container} .animate-sidebar`,
      translateX: [50, 0],
      opacity: [0, 1],
      duration: 600
    }, '-=300');
    
    return tl;
  },

  // Card grid animation
  cardGrid: (container: string | Element) => {
    return animeUtils.staggerIn(`${container} .anime-card`, {
      delay: anime.stagger(100, {grid: [3, 3], from: 'center'})
    });
  },

  // Loading animation
  loading: (targets: string | Element | NodeList) => {
    return anime({
      targets,
      rotate: '1turn',
      duration: 1000,
      loop: true,
      easing: 'linear'
    });
  },

  // Success animation
  success: (targets: string | Element | NodeList) => {
    const tl = animeUtils.createTimeline();
    
    tl.add({
      targets,
      scale: [0, 1.2],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutBack'
    })
    .add({
      targets,
      scale: [1.2, 1],
      duration: 200,
      easing: 'easeInBack'
    });
    
    return tl;
  },

  // Error shake animation
  error: (targets: string | Element | NodeList) => {
    return anime({
      targets,
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 500,
      easing: 'easeInOutQuad'
    });
  }
};

export default anime;