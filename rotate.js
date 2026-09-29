const record = document.getElementById("record");

let rotation = 0;
let lastAngle = 0;
let dragging = false;

// Get the center of the record
function getRecordCenter() {
  const rect = record.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

// Calculate angle from center to cursor
function getAngle(event) {
  const center = getRecordCenter();
  const dx = event.clientX - center.x;
  const dy = event.clientY - center.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

record.addEventListener("pointerdown", (event) => {
  dragging = true;
  lastAngle = getAngle(event);

  // Stop automatic rotation while scratching
  record.style.animation = "none";

  // Keep tracking even if pointer leaves the element
  record.setPointerCapture(event.pointerId);

  record.classList.add("scratching");
});

record.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  const currentAngle = getAngle(event);
  let angleDiff = currentAngle - lastAngle;

  // Handle angle wrap-around (e.g., from 170° to -170°)
  if (angleDiff > 180) {
    angleDiff -= 360;
  } else if (angleDiff < -180) {
    angleDiff += 360;
  }

  rotation += angleDiff;

  record.style.transform = `rotate(${rotation}deg)`;

  lastAngle = currentAngle;
});

function stopScratching(event) {
  if (!dragging) return;

  dragging = false;
  record.classList.remove("scratching");

  if (event.pointerId !== undefined) {
    record.releasePointerCapture?.(event.pointerId);
  }
}

record.addEventListener("pointerup", stopScratching);
record.addEventListener("pointercancel", stopScratching);
