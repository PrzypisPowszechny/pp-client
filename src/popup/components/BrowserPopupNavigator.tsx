import React, { ChangeEvent } from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationList from './annotationList/AnnotationList';

export enum PopupPages {
  main,
  annotationList,
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

  handlePageChange = (page: PopupPages) => {
    this.setState({ page });
  }

  render() {
    switch (this.state.page) {
      case PopupPages.annotationList:
        return (<AnnotationList onPageChange={this.handlePageChange}/>);
      case PopupPages.main:
      default:
        return (<BrowserPopup onPageChange={this.handlePageChange}/>);
    }
  }

}
