import React from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationList from './annotationList/AnnotationList';
import { trySelectRealTab, trySelectTab } from '../../common/store/tabs/selectors';
import { connect } from 'react-redux';
import { trySelectStorage, selectUser } from '../../common/store/storage/selectors';
import LoginForm from './LoginForm';
import { ITabState } from '../../common/store/tabs/tab/reducer';

export enum PopupPages {
  main,
  annotationList,
}

export interface IBrowserPopupNavigatorProps {
  tab: ITabState;
  storage: boolean;
  user: any;
  isPopupEmulatedAndInvalid: boolean;
}

interface IBrowserPopupNavigatorState {
  page: PopupPages;
}


@connect(
  state => {
    const realTab = trySelectRealTab(state);
    let isPopupEmulatedAndInvalid = false;
    if (realTab) {
      const {
        debugIsTabPopupEmulated,
        debugIsTabValid,
      } = realTab.tabInfo;
      isPopupEmulatedAndInvalid = debugIsTabPopupEmulated && !debugIsTabValid;
      console.log('invalid:', isPopupEmulatedAndInvalid)
    }


    return {
      tab: trySelectTab(state),
      storage: trySelectStorage(state),
      user: selectUser(state),
      isPopupEmulatedAndInvalid,
    };
  },
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

  renderEmptyPopup() {
    return (<div className="pp-popup"/>);
  }

  render() {
    /*
     * Before rendering any further components make sure the store has been initialized enough to use:
     * - that the tab-specific part of state has been initialized
     * - that the browser storage has been loaded to the store
     */
    const {
      tab,
      storage,
      user,
      isPopupEmulatedAndInvalid,
    } = this.props;
    console.log(tab, storage, user);

    // if (!tab || !storage) {
    //   return this.renderEmptyPopup();
    // }

    if (PPSettings.DEV && isPopupEmulatedAndInvalid) {
      return (<span> The tab id for an emulated popup
        does not match any existing tab or no content script was injected into the matching tab
      </span>);
    }
    /*
     * Also make sure that:
     * - the basic info on the current tab has been initialized
     */

    if (!tab || !storage || !tab.tabInfo.currentUrl) {
      return this.renderEmptyPopup();
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
