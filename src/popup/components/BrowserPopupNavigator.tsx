import React from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationList from './annotationList/AnnotationList';
import { selectIsTabInitialized } from '../../common/store/tabs/selectors';
import { connect } from 'react-redux';
import { selectIsStorageInitialized, selectUser } from '../../common/store/storage/selectors';
import LoginForm from './LoginForm';

export enum PopupPages {
  main,
  annotationList,
}

export interface IBrowserPopupNavigatorProps {
  isTabInitialized: boolean;
  isStorageInitialized: boolean;
  user: any;
}

interface IBrowserPopupNavigatorState {
  page: PopupPages;
}

@connect(
  state => ({
    isTabInitialized: selectIsTabInitialized(state),
    isStorageInitialized: selectIsStorageInitialized(state),
    user: selectUser(state),
  }),
)
export default class BrowserPopupNavigator extends React.Component<Partial<IBrowserPopupNavigatorProps>,
  Partial<IBrowserPopupNavigatorState>> {
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
    const {
      isTabInitialized,
      isStorageInitialized,
      user,
    } = this.props;
    if (!isTabInitialized || !isStorageInitialized) {
      return (<div className="pp-popup"/>);
    }
    if (!user) {
      return (
        <div>
          <LoginForm/>
        </div>
      );
    }

    switch (this.state.page) {
      case PopupPages.annotationList:
        return (<AnnotationList onPageChange={this.handlePageChange}/>);
      case PopupPages.main:
      default:
        return (<BrowserPopup onPageChange={this.handlePageChange}/>);
    }
  }

}
