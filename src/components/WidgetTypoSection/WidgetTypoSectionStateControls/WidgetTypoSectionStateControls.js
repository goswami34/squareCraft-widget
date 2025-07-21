export function WidgetTypoSectionStateControls() {
  const buttonIds = ["typo-normal-state", "typo-hover-state"];
  const sectionIds = ["typo-normal-state-section", "typo-hover-state-section"];
  buttonIds.forEach((btnId, index) => {
    const button = document.getElementById(btnId);
    const section = document.getElementById(sectionIds[index]);
    if (!button || !section) return;
    button.addEventListener("click", () => {
      buttonIds.forEach((otherBtnId, i) => {
        const otherButton = document.getElementById(otherBtnId);
        const otherSection = document.getElementById(sectionIds[i]);
        if (!otherButton || !otherSection) return;
        if (i === index) {
          otherButton.classList.add(
            "sc-bg-color-EF7C2F",
            "sc-text-color-white"
          );
          otherButton.classList.remove("sc-bg-3f3f3f");
          otherSection.classList.remove("sc-hidden");
        } else {
          otherButton.classList.remove(
            "sc-bg-color-EF7C2F",
            "sc-text-color-white"
          );
          otherButton.classList.add("sc-bg-3f3f3f");
          otherSection.classList.add("sc-hidden");
        }
      });
    });
  });
}
