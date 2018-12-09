import React, { ChangeEvent } from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationRequestForm from './AnnotationRequestForm';

enum PopupPages {
  main,
  annotationRequestForm,
}

interface IBrowserPopupNavigatorState {
  page: PopupPages;
}

export default class BrowserPopupNavigator extends React.Component<{}, Partial<IBrowserPopupNavigatorState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      page: PopupPages.main,
    };
  }

  render() {
    switch (this.state.page) {
      case PopupPages.annotationRequestForm:
        return (<AnnotationRequestForm/>);
      case PopupPages.main:
      default:
        return (<BrowserPopup/>);
    }
  }

}
