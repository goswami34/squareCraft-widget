const initOverlaySlider = (selector, key) => {
  const field = document.querySelector(selector);
  const bullet = field?.querySelector(".sc-custom-overlay-bullet");
  const valueDisplay = field
    ?.closest(".sc-w-full")
    ?.querySelector(".sc-text-xs");

  if (!field || !bullet) return;

  // Set initial value
  const setUI = (percent) => {
    const sliderWidth = field.offsetWidth;
    const px = (percent / 100) * sliderWidth;
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";

    // Map percent (0-100) to value (-100 to 100)
    const value = Math.round((percent / 100) * 200 - 100);
    overlayState[key] = value;
    if (valueDisplay) valueDisplay.textContent = `${value}px`;
    updateOverlayStyles();
  };

  // Initialize to current overlay value
  setTimeout(() => {
    const percent = ((overlayState[key] + 100) / 200) * 100;
    setUI(percent);
  }, 50);

  const startDrag = (e) => {
    e.preventDefault();
    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percent = (offsetX / rect.width) * 100;
      setUI(percent);
    };
    const stopDrag = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", stopDrag);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", stopDrag);
  };

  bullet.addEventListener("mousedown", startDrag);
  bullet.addEventListener("touchstart", startDrag);
};
