
export function isInverted(widget, window) {
    // console.log('orientation');
    // TODO replace annotator jQuery with pure js
    const win = $(window);

    if (widget) {
      const $widget = $(widget);
      const offset = $widget.offset();
      const viewport = {
        top: win.scrollTop(),
        right: win.width() + win.scrollLeft(),
      };
      const current = {
        top: offset.top,
        right: offset.left + $widget.width(),
      };
      // console.log(this.props);
      let invertedX = false;
      if ((current.right - viewport.right) > 0) {
        invertedX = true;
      }

      let invertedY = false;
      if ((current.top - viewport.top) < 0) {
        invertedY = true;
      }
      return {
        invertedX,
        invertedY,
      };
    }
  }
