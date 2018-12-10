import React, { ChangeEvent } from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationRequestForm from './AnnotationRequestForm';
import { getCurrentTabUrl } from '../utils';

enum PopupPages {
  main,
  annotationRequestForm,
}

interface IBrowserPopupNavigatorState {
  page: PopupPages;
  currentTabUrl: string;
}

export default class BrowserPopupNavigator extends React.Component<{}, Partial<IBrowserPopupNavigatorState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      page: PopupPages.main,
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
        return (<AnnotationRequestForm formData={{ url: this.state.currentTabUrl }}/>);
      case PopupPages.main:
      default:
        return (<BrowserPopup onAnnotationRequestSelect={this.handleAnnotationRequestSelect}/>);
    }
  }

}
