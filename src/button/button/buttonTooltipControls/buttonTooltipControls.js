export function buttonTooltipControls() {
    const tooltipTargets = document.querySelectorAll('.sc-tooltip-target');
  
    tooltipTargets.forEach(el => {
      const tooltip = el.querySelector('.sc-tooltip');
      if (!tooltip) return;
  
      let showTimeout;
  
      el.addEventListener('mouseenter', () => {
        showTimeout = setTimeout(() => {
          tooltip.classList.add('sc-visible');
        }, 1000); 
      });
  
      el.addEventListener('mouseleave', () => {
        clearTimeout(showTimeout);
        tooltip.classList.remove('sc-visible');
      });
    });
  }
  