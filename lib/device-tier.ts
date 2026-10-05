// Device tier detection as per PRD Sec 9.3 and Design Spec Sec 5.4

export type DeviceTier = 'high' | 'medium' | 'low';

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';

  // Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'low';
  } catch (e) {
    return 'low';
  }

  // Mobile / Hardware heuristics
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  if (isMobile) {
    if (hardwareConcurrency <= 4) {
      return 'low';
    }
    return 'medium';
  }

  if (hardwareConcurrency < 4) {
    return 'medium';
  }

  return 'high';
}
