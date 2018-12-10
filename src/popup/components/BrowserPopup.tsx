import React, { ChangeEvent } from 'react';
import BrowserPopupMenu from './BrowserPopupMenu';
import AnnotationRequestForm from './AnnotationRequestForm';
import { getCurrentTabUrl } from '../utils';

enum PopupPages {
  menu,
  annotationRequestForm,
}

interface IBrowserPopupState {
  page: PopupPages;
  currentTabUrl: string;
}

export default class BrowserPopup extends React.Component<{}, Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      page: PopupPages.menu,
    };
  }

  componentDidMount() {
    getCurrentTabUrl().then((url) => {
      this.setState({ currentTabUrl: url });
    });
  }

  handleAnnotationRequestSelect = () => {
    this.setState({ page: PopupPages.annotationRequestForm });
  }

  render() {
    console.log('render');
    switch (this.state.page) {
      case PopupPages.annotationRequestForm:
        return (
          <AnnotationRequestForm
            formData={{ url: this.state.currentTabUrl }}
          />
        );
      case PopupPages.menu:
      default:
        return (
          <BrowserPopupMenu
            onAnnotationRequestSelect={this.handleAnnotationRequestSelect}
          />
        );
    }
  }

}
