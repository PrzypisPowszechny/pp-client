import React, { ChangeEvent } from 'react';

import addIcon from '../../../assets/pp-add-icon.svg';
import requestIcon from '../../../assets/pp-request-icon.svg';
import switchOffIcon from '../../../assets/pp-switch-off-icon.svg';

import { standardizeUrlForPageSettings } from 'utils/url';
import Toggle from './toggle/toggle';
import chromeStorage from 'chrome-storage';
import * as chromeKeys from 'chrome-storage/keys';
import _filter from 'lodash/filter';
import classNames from 'classnames';

interface IBrowserPopupState {
  isLoading: boolean;
  currentTabUrl: string;
  annotationModePages: string[];
  isExtensionDisabled: boolean;
  disabledPages: string[];
}

export default class BrowserPopup extends React.Component<{}, Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      currentTabUrl: null,
      annotationModePages: [],
      isExtensionDisabled: false,
      disabledPages: [],
    };
  }

  loadStateFromStorage() {
    /* Use data from chrome storage to update popup state
     * It is assumed that there are no other sources of data;
     * In the future:
     *   for more sources of data, resort to a local popup Redux store or a global background page Redux store
     */
    if (this.state.isLoading) {
      chromeStorage.get([
        chromeKeys.ANNOTATION_MODE_PAGES,
        chromeKeys.DISABLED_EXTENSION,
        chromeKeys.DISABLED_PAGES,
      ], (result) => {
        this.setState({
          isLoading: false,
          annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
          isExtensionDisabled: result[chromeKeys.DISABLED_EXTENSION] || false,
          disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
        });
      });
    }

  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      this.setState({ currentTabUrl: standardizeUrlForPageSettings(tab.url) });
    });

    this.loadStateFromStorage();
  }

  componentDidUpdate() {
    this.loadStateFromStorage();
  }

  isExtensionDisabledForCurrentTab() {
    return (this.state.disabledPages || []).indexOf(this.state.currentTabUrl) !== -1;
  }

  isAnnotationModeForCurrentTab() {
    return (this.state.annotationModePages || []).indexOf(this.state.currentTabUrl) !== -1;
  }

  /*
   * ON POPUP STATE PERSISTENCE
   * We need to both update the storage and the local state
   * - storage, because we need to communicate changes to other parts of the application
   * - state, because there is no other clean method to ensure state continuity, so we can have interface transitions
   * This method of communication with content scripts in fact proves cumbersome;
   * we could consider moving to react-redux-chrome instead of refining it
   */
  handleAnnotationModeClick = (e) => {
    const {
      annotationModePages,
      currentTabUrl,
    } = this.state;

    const isAnnotationMode = this.isAnnotationModeForCurrentTab();
    if (!isAnnotationMode) {
      let newAnnotationModePages;
      newAnnotationModePages = [...annotationModePages, currentTabUrl];
      this.setState({ annotationModePages: newAnnotationModePages });
      chromeStorage.set({ [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages });
      window.close();
    }
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    this.setState({ isExtensionDisabled: newValue });
    chromeStorage.set({ [chromeKeys.DISABLED_EXTENSION]: newValue });
  }

  handleDisabledPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const {
      disabledPages,
      currentTabUrl,
      annotationModePages,
    } = this.state;

    let newDisabledPages;
    if (checked) {
      newDisabledPages = [...disabledPages, currentTabUrl];
    } else {
      newDisabledPages = _filter(disabledPages, url => url !== currentTabUrl);
    }
    // Permanently turn off the annotation mode for the disabled pages
    const newAnnotationModePages = _filter(annotationModePages, url => !newDisabledPages.includes(url));

    this.setState({
      disabledPages: newDisabledPages,
      annotationModePages: newAnnotationModePages,
    });
    chromeStorage.set({
      [chromeKeys.DISABLED_PAGES]: newDisabledPages,
      [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
    });
  }

  render() {
    const {
      isLoading,
      isExtensionDisabled,
    } = this.state;

    const isCurrentPageDisabled = this.isExtensionDisabledForCurrentTab();
    const isAnnotationMode = this.isAnnotationModeForCurrentTab();

    if (isLoading) {
      // Do not display the page already, when loading; otherwise we'll always see the toggle transition...
      return null;
    }

    return (
      <div className="pp-popup">
        <ul className="menu">
          <li
            className={classNames('menu__item', 'clickable',
              { disabled: isAnnotationMode || isExtensionDisabled || isCurrentPageDisabled })}
            onClick={this.handleAnnotationModeClick}
          >
            <img className="menu__item__icon" src={addIcon}/>
            <a>Dodaj przypis</a>
          </li>
          <hr className="menu__separator"/>
          <li className="menu__item">
            <img className="menu__item__icon" src={switchOffIcon}/>
            <span>Wyłącz wtyczkę</span>
            <Toggle
              checked={isExtensionDisabled}
              onChange={this.handleDisabledExtensionChange}
            />
          </li>
          <li className="menu__sub-item">
            <span>tylko na tej stronie</span>
            <Toggle
              checked={isCurrentPageDisabled}
              onChange={this.handleDisabledPageChange}
            />
          </li>
        </ul>
      </div>
    );
  }
}
