import styles from './Widget.scss';

export function isInverted(widget, window) {
    // TODO replace annotator jQuery with pure js
    const win = $(window);
    const transparentOffset = parseInt(styles.transparentOffsetSize, 10);

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
      let invertedX = false;
      if ((current.right - viewport.right) > transparentOffset) {
        invertedX = true;
      }

      let invertedY = false;
      if ((current.top - viewport.top) < transparentOffset) {
        invertedY = true;
      }
      return {
        invertedX,
        invertedY,
      };
    }
  }
