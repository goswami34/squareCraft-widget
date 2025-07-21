export function ButtonAdvanceToggleControls() {
  const buttonIds = [
    "button-advance-vertical",
    "button-advance-horizontal",
    "button-advance-opacity",
    "button-advance-scale",
    "button-advance-rotate",
    "button-advance-blur",
  ];

  buttonIds.forEach((btnId) => {
    const button = document.getElementById(btnId);
    const sectionId = `${btnId}-section`;

    if (button && document.getElementById(sectionId)) {
      const handleInteraction = () => {
        buttonIds.forEach((otherBtnId) => {
          const otherSection = document.getElementById(`${otherBtnId}-section`);
          if (!otherSection) return;

          if (otherBtnId === btnId) {
            otherSection.classList.remove("sc-hidden");
            otherSection.classList.add("sc-visible");
            otherSection.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            otherSection.classList.remove("sc-visible");
            otherSection.classList.add("sc-hidden");
          }
        });
      };

      button.addEventListener("click", handleInteraction);
    }
  });
}
