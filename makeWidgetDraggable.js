export function makeWidgetDraggable(widgetContainer) {
    if (!widgetContainer) return;

    widgetContainer.style.position = "absolute";
    widgetContainer.style.zIndex = "999";
    widgetContainer.style.left = "10px";
    widgetContainer.style.top = "10px";

    let offsetX = 0,
        offsetY = 0,
        isDragging = false;

    function startDrag(event) {
        const draggableElement = event.target.closest("#sc-grabbing");

        if (!draggableElement || event.target.closest(".sc-dropdown")) {
            return;
        }

        event.preventDefault();
        isDragging = true;

        let clientX = event.clientX || event.touches?.[0]?.clientX;
        let clientY = event.clientY || event.touches?.[0]?.clientY;

        offsetX = clientX - widgetContainer.getBoundingClientRect().left;
        offsetY = clientY - widgetContainer.getBoundingClientRect().top;

        document.addEventListener("mousemove", moveAt);
        document.addEventListener("mouseup", stopDragging);
        document.addEventListener("touchmove", moveAt);
        document.addEventListener("touchend", stopDragging);
    }

    function moveAt(event) {
        if (!isDragging) return;

        let clientX = event.clientX || event.touches?.[0]?.clientX;
        let clientY = event.clientY || event.touches?.[0]?.clientY;

        let newX = clientX - offsetX;
        let newY = clientY - offsetY;

        let maxX = window.innerWidth - widgetContainer.offsetWidth;
        let maxY = window.innerHeight - widgetContainer.offsetHeight;

        newX = Math.max(0, Math.min(maxX, newX));
        newY = Math.max(0, Math.min(maxY, newY));

        widgetContainer.style.left = `${newX}px`;
        widgetContainer.style.top = `${newY}px`;
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener("mousemove", moveAt);
        document.removeEventListener("mouseup", stopDragging);
        document.removeEventListener("touchmove", moveAt);
        document.removeEventListener("touchend", stopDragging);
    }

    widgetContainer.removeEventListener("mousedown", startDrag);
    widgetContainer.removeEventListener("touchstart", startDrag);

    widgetContainer.addEventListener("mousedown", startDrag);
    widgetContainer.addEventListener("touchstart", startDrag);
}
