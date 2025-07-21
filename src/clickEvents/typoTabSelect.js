export function typoTabSelect(event) {
  const clicked = event.target.closest("div[id$='Select']");
  if (!clicked) return;
  const dropdown = clicked.closest("[id$='Dropdown']");
  if (!dropdown) return;
  const baseId = clicked.id.split("-")[0];
  const suffix = clicked.id.split("-")[1];
  const styleIds = ["allSelect", "boldSelect", "italicSelect", "linkSelect"];
  if (!styleIds.includes(suffix)) return;
  styleIds.forEach((sfx) => {
    const fullId = `${baseId}-${sfx}`;
    const tab = dropdown.querySelector(`#${fullId}`);
    const desc = dropdown.querySelector(`#scDesc-${fullId}`);
    if (tab) {
      if (tab === clicked) {
        tab.classList.add("sc-select-activeTab-border");
        tab.classList.remove("sc-select-inActiveTab-border");
      } else {
        tab.classList.remove("sc-select-activeTab-border");
        tab.classList.add("sc-select-inActiveTab-border");
      }
    }
    if (desc) {
      if (clicked.id === fullId) {
        desc.classList.remove("sc-hidden");
      } else {
        desc.classList.add("sc-hidden");
      }
    }
  });
}