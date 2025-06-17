export function initHoverButtonSectionToggleControls() {
  const hoverSections = {
    "hover-colorButton": "hover-colorSection",
    "hover-iconButton": "hover-iconSection",
    "hover-bordersButton": "hover-bordersSection",
    "hover-shadowsButton": "hover-shadowsSection",
    "hover-buttonEffect": "hover-buttonEffectSection"
  };

  const arrowMap = {
    "hover-colorButton": "hover-button-color-arrow",
    "hover-iconButton": "hover-button-icon-arrow",
    "hover-bordersButton": "hover-button-border-arrow",
    "hover-shadowsButton": "hover-button-shadow-arrow",
    "hover-buttonEffect": "hover-button-effects-arrow"
  };

  Object.keys(hoverSections).forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    const sectionId = hoverSections[buttonId];
    const arrowId = arrowMap[buttonId];
    const arrow = document.getElementById(arrowId);

    if (button && document.getElementById(sectionId)) {
      button.addEventListener("click", () => {
        Object.keys(hoverSections).forEach((otherButtonId) => {
          const otherSectionId = hoverSections[otherButtonId];
          const otherSection = document.getElementById(otherSectionId);
          const otherArrowId = arrowMap[otherButtonId];
          const otherArrow = document.getElementById(otherArrowId);

          if (otherButtonId === buttonId) {
            otherSection.classList.remove("sc-hidden");
            otherSection.classList.add("sc-visible");
            otherSection.scrollIntoView({ behavior: "smooth", block: "start" });

            if (otherArrow) {
              otherArrow.classList.remove("sc-rotate-180");
              otherArrow.style.transition = "transform 0.3s ease";
            }
          } else {
            if (otherSection) {
              otherSection.classList.add("sc-hidden");
              otherSection.classList.remove("sc-visible");
            }
            if (otherArrow && !otherArrow.classList.contains("sc-rotate-180")) {
              otherArrow.classList.add("sc-rotate-180");
              otherArrow.style.transition = "transform 0.3s ease";
            }
          }
        });
      });
    }
  });

  const durationDropdown = document.getElementById("hover-all-color-selction-bar");
  const durationSelect = document.getElementById("hover-buttonDuration Select");
  const durationLabel = document.getElementById("hover-buttonDurationLabel");

  if (durationDropdown && durationSelect && durationLabel) {
    durationSelect.addEventListener("click", (e) => {
      e.stopPropagation();
      durationDropdown.classList.toggle("sc-hidden");
    });

    durationDropdown.querySelectorAll("[data-value]").forEach(item => {
      item.addEventListener("click", () => {
        durationLabel.textContent = item.getAttribute("data-value");
        durationDropdown.classList.add("sc-hidden");
      });
    });

    document.addEventListener("click", (e) => {
      if (!durationDropdown.contains(e.target) && !durationSelect.contains(e.target)) {
        durationDropdown.classList.add("sc-hidden");
      }
    });
  }
  
}



export function initHoverButtonEffectDropdowns() {
  let lastOpenedDropdown = null;

  const dropdownMap = [
    { key: "TransitionType",label:"TransitionTypeLabel", dropdown:"TransitionDropdown", select: "TransitionTypeSelect" }, 
    { key: "Duration" },
    { key: "Delay", label: "DelayLabel", dropdown: "DelayDropdown", select: "DelayTypeSelect" }, 
    { key: "Transform", label: "TransformTypeLabel", dropdown: "TransformDropdown", select: "TransformTypeSelect" } 
  ];

  dropdownMap.forEach(({ key, label, dropdown, select }) => {
    const labelId = `hover-button${label || key + "Label"}`;
    const dropdownId = `hover-button${dropdown || key + "Dropdown"}`;
    const selectId = `hover-button${select || key + "Select"}`;

    const labelEl = document.getElementById(labelId);
    const dropdownEl = document.getElementById(dropdownId);
    const selectEl = document.getElementById(selectId);

    if (labelEl && dropdownEl && selectEl) {
      selectEl.addEventListener("click", (e) => {
        e.stopPropagation();

        if (lastOpenedDropdown && lastOpenedDropdown !== dropdownEl) {
          lastOpenedDropdown.classList.add("sc-hidden");
        }

        const isHidden = dropdownEl.classList.contains("sc-hidden");
        dropdownEl.classList.toggle("sc-hidden", !isHidden);
        lastOpenedDropdown = isHidden ? dropdownEl : null;
      });

      dropdownEl.querySelectorAll("[data-value]").forEach(item => {
        item.addEventListener("click", () => {
          labelEl.textContent = item.getAttribute("data-value");
          dropdownEl.classList.add("sc-hidden");
          lastOpenedDropdown = null;
        });
      });
    }
  });

  document.addEventListener("click", (e) => {
    dropdownMap.forEach(({ key, dropdown, select }) => {
      const dropdownEl = document.getElementById(`hover-button${dropdown || key + "Dropdown"}`);
      const selectEl = document.getElementById(`hover-button${select || key + "Select"}`);

      if (dropdownEl && !dropdownEl.contains(e.target) && !selectEl.contains(e.target)) {
        dropdownEl.classList.add("sc-hidden");
      }
    });
    lastOpenedDropdown = null;
  });
}



