export function mousePosition(event) {
  const body = global.document.body;
  let offset = { top: 0, left: 0 };

  if ($(body).css('position') !== "static") {
    offset = $(body).offset();
  }

  return {
    x: event.pageX - offset.left,
    y: event.pageY - offset.top,
  };
}
