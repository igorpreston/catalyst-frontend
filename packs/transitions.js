import { TweenMax } from 'gsap'

const gsapOpts = cb => {
  return {
    onComplete: cb,
    ease: '.25, .8, .5, 1'
  }
}

const transitions = {
  methods: {
    fadeOutLeft (el, done) {
      TweenMax.fromTo(el, 0.25, {opacity: 1, x: 0}, {opacity: 0, x: -50, ...gsapOpts(done)})
    },

    fadeInRight (el, done) {
      TweenMax.fromTo(el, 0.25, {opacity: 0, x: -50}, {opacity: 1, x: 0, ...gsapOpts(done)})
    },

    slideInLeft (el, done) {
      TweenMax.fromTo(el, 0.25, {width: 0}, {width: this.width, ...gsapOpts(done)})
    },

    slideOutRight (el, done) {
      TweenMax.fromTo(el, 0.25, {width: this.width}, {width: 0, display: 'none', ...gsapOpts(done)})
    },

    fadeIn (el, done) {
      TweenMax.fromTo(el, 0.15, {opacity: 0}, {opacity: 1, ...gsapOpts(done)})
    }
  }
}

export default transitions
