/**
 * Dynamically adjusts the root font-size of an iframe document to scale its content
 * so that it fits perfectly within a target height (e.g. an A4 page).
 * 
 * @param {HTMLIFrameElement} iframe The iframe containing the rendered resume
 * @param {number} targetHeight The maximum height allowed (e.g., 1123 for A4 at 96 DPI)
 * @returns Promise that resolves when scaling is complete
 */
export async function autoFitIframeContent(iframe, targetHeight = 1100) {
  return new Promise((resolve) => {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return resolve();

      // We assume the template wraps its main content in an element with class .ats-resume or .resume.
      // If none found, we fallback to body.
      const contentEl = doc.querySelector('.ats-resume') || doc.querySelector('.resume') || doc.body;
      if (!contentEl) return resolve();

      let currentSize = 16; // default rem size in px
      doc.documentElement.style.fontSize = currentSize + 'px';

      let attempts = 0;
      
      const adjust = () => {
        attempts++;
        // scrollHeight includes padding and all content
        const height = contentEl.scrollHeight;
        
        // Stop condition: if height is within 10px of target, OR we hit max attempts
        // Also if height is exactly target, we stop.
        if (Math.abs(height - targetHeight) < 10 || attempts > 20) {
          return resolve();
        }

        const ratio = targetHeight / height;
        
        // Clamp root font size between 10px (minimum readability) and 24px (maximum up-scaling)
        let newSize = currentSize * ratio;
        
        // Dampening factor to prevent oscillation when elements wrap text differently at different sizes
        newSize = currentSize + (newSize - currentSize) * 0.6; 
        newSize = Math.max(10, Math.min(24, newSize));
        
        // If the change is microscopic, stop.
        if (Math.abs(newSize - currentSize) < 0.1) {
          return resolve();
        }

        currentSize = newSize;
        doc.documentElement.style.fontSize = currentSize + 'px';
        
        // Give the browser time to reflow layout before measuring again
        setTimeout(adjust, 25); 
      };

      // Start the loop after initial render
      setTimeout(adjust, 50);
    } catch (error) {
      console.error("Auto-fit failed:", error);
      resolve();
    }
  });
}
