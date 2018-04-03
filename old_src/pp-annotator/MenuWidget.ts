import annotator from 'annotator';
import _ from 'lodash';
import AnnotationViewModel from './annotation/AnnotationViewModel';

const { ui, util } = annotator;
const { widget: { Widget } } = ui;

// annotator jquery for consistency
const { $ } = util;

/**
 * Adder shows and hides an annotation menu button that can be clicked on to
 * create an annotation.
 *
 * MenuWidget is for the most part a copy of annotator.Adder, except with two buttons, thus:
 * onCreate callback replaced with beginAnnotationCreate and beforeRequestCreate
 */

interface IMenuWidgetOptions extends annotator.ui.widget.IWidgetOptions {
  beginAnnotationCreate?: (annotation: AnnotationViewModel, e: JQuery.Event) => void;
}

export default class MenuWidget extends Widget {
  static options: IMenuWidgetOptions = {};

  static template = `
  <div class="pp-ui pp-menu-widget pp-hide">
    <button class="create-annotation ui basic pointing below label large">
        <i class="plus icon"></i>Dodaj przypis
    </button>
  </div>`;

  static classes = {
    hide: 'pp-hide',
    focus: 'annotator-focus',
    invert: Widget.classes.invert,
  };

  private static NS = 'przypis-adder';

  private static getNSTag(tag: string) {
    return `${tag}${MenuWidget.NS}`;
  }

  private ignoreMouseup: boolean;
  private annotation: AnnotationViewModel | null;
  private beginAnnotationCreate: IMenuWidgetOptions['beginAnnotationCreate'];
  private document: Document;

  constructor(options?: IMenuWidgetOptions) {
    super(options || {});

    this.ignoreMouseup = false;
    this.annotation = null;

    this.beginAnnotationCreate =
      MenuWidget.options.beginAnnotationCreate || options.beginAnnotationCreate;

    const clickTag = MenuWidget.getNSTag(`click.`);
    const mouseDownTag = MenuWidget.getNSTag(`mousedown.`);
    const mouseUpTag = MenuWidget.getNSTag(`mouseup.`);

    this.element
      .on(clickTag, 'button', this.onClick.bind(this))
      .on(mouseDownTag, 'button', this.onMouseDown.bind(this));

    this.document = this.element[0].ownerDocument;
    $(this.document.body).on(mouseUpTag, this.onMouseUp);
  }

  /**
   * Public: Show the menu.
   *
   * Examples
   *  menu.show()
   *  menu.hide()
   *  menu.show({top: '100px', left: '80px'})
   *
   * @param position an Object specifying the position in which to show the editor (optional).
   */
  show(position?: annotator.util.IPosition | null) {
    if (position) {
      this.element.css({
        left: position.left,
        top: position.top,
      });
    }

    super.show();
  }

  destroy() {
    const offTag = MenuWidget.getNSTag(`.`);

    this.element.off(offTag);
    $(this.document.body).off(offTag);

    super.destroy();
  }

  /**
   * Public: Load an annotation and show the menu.
   *
   * If the user clicks on the menu with an annotation loaded, the onCreate
   * handler will be called. In this way, the menu can serve as an
   * intermediary step between making a selection and creating an annotation.
   *
   * @param annotation an annotation Object to load.
   * @param position an Object specifying the position in which to show the editor (optional).
   */
  load(annotation: AnnotationViewModel, position: annotator.util.IPosition | null) {
    this.annotation = annotation;
    this.show(position);
  }

  /**
   * Event callback: called when the mouse button is pressed on the menu.
   *
   * @param event a mousedown Event object
   */
  private onMouseDown(event: JQuery.Event) {
    // Do nothing for right-clicks, middle-clicks, etc.
    if (event.which > 1) {
      return;
    }

    event.preventDefault();

    // Prevent the selection code from firing when the mouse button is released
    this.ignoreMouseup = true;
  }

  /**
   * Event callback: called when the mouse button is released
   *
   * @param event a mouseup Event object
   */
  private onMouseUp(event: JQuery.Event) {
    // Do nothing for right-clicks, middle-clicks, etc.
    if (event.which > 1) {
      return;
    }

    // Prevent the selection code from firing when the ignoreMouseup flag is set
    if (this.ignoreMouseup) {
      event.stopImmediatePropagation();
    }
  }

  /**
   * Event callback: called when the menu is clicked. The click event is used
   * as well as the mousedown so that we get the :active state on the menu
   * when clicked.
   *
   * event - A mousedown Event object
   *
   * Returns nothing.
   */
  private onClick(event: JQuery.Event) {
    // Do nothing for right-clicks, middle-clicks, etc.
    if (event.which > 1) {
      return;
    }

    event.preventDefault();

    // Hide the menu
    this.hide();
    this.ignoreMouseup = false;

    if (this.annotation) {
      // create annotation button clicked
      if (
        event.target === this.element.find('.create-annotation')[0] &&
        _.isFunction(this.beginAnnotationCreate)
      ) {
        this.beginAnnotationCreate(this.annotation, event);
      }
    }
  }
}
