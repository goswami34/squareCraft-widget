export function initImageSectionToggleControls() {
  const sections = {
    borderButton: "borderSection",
    overLayButton: "overLaySection",
    shadowButton: "shadowSection",
  };

  Object.keys(sections).forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    const sectionId = sections[buttonId];

    if (button && document.getElementById(sectionId)) {
      button.addEventListener("click", () => {
        Object.entries(sections).forEach(([btnId, secId]) => {
          const section = document.getElementById(secId);
          if (!section) return;

          if (btnId === buttonId) {
            section.classList.remove("sc-hidden");
            section.classList.add("sc-visible");

            section.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            section.classList.remove("sc-visible");
            section.classList.add("sc-hidden");
          }
        });
      });
    }
  });
}
