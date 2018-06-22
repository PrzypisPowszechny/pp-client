import React, { ChangeEvent } from 'react';

import addIcon from '../../../assets/pp-add-icon.svg';
import requestIcon from '../../../assets/pp-request-icon.svg';
import switchOffIcon from '../../../assets/pp-switch-off-icon.svg';

import { standardizeURL } from 'utils/url';
import Toggle from './toggle/toggle';
import chromeStorage from 'chrome-storage';
import * as chromeKeys from 'chrome-storage/keys';
import _filter from 'lodash/filter';
import classNames from 'classnames';

declare const chrome: any;

interface IBrowserPopupState {
  isLoading: boolean;
  currentTabURL: string;
  annotationMode: boolean;
  disabledExtension: boolean;
  disabledPages: string[];
}

export default class BrowserPopup extends React.Component<{}, Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      currentTabURL: null,
      annotationMode: false,
      disabledExtension: false,
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
        chromeKeys.ANNOTATION_MODE,
        chromeKeys.DISABLED_EXTENSION,
        chromeKeys.DISABLED_PAGES,
      ], (result) => {
        this.setState({
          isLoading: false,
          annotationMode: result[chromeKeys.ANNOTATION_MODE] || false,
          disabledExtension: result[chromeKeys.DISABLED_EXTENSION] || false,
          disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
        });
      });
    }

  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      this.setState({ currentTabURL: standardizeURL(tab.url) });
    });

    this.loadStateFromStorage();
  }

  componentDidUpdate() {
    this.loadStateFromStorage();
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
    this.setState({ annotationMode: true });
    chromeStorage.set({ [chromeKeys.ANNOTATION_MODE]: true });
    window.close();
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    this.setState({ disabledExtension: newValue });
  }

  handleDisabledPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const {
      disabledPages,
      currentTabURL,
    } = this.state;

    let newDisabledList;
    if (checked) {
      newDisabledList = [...disabledPages, currentTabURL];
    } else {
      newDisabledList = _filter(disabledPages, url => url !== currentTabURL);
    }
    this.setState({ disabledPages: newDisabledList });
    chromeStorage.set({ [chromeKeys.DISABLED_PAGES]: newDisabledList });
  }

  render() {
    const {
      isLoading,
      currentTabURL,
      annotationMode,
      disabledExtension,
      disabledPages,
    } = this.state;
    const isDisabled = (disabledPages || []).indexOf(currentTabURL) !== -1;

    if (isLoading) {
      // Do not display the page already, when loading; otherwise we'll always see the toggle transition...
      return null;
    }

    return (
      <div className="pp-popup">
        <ul className="menu">
          <li
            className={classNames('menu__item', 'clickable', { disabled: annotationMode })}
            onClick={this.handleAnnotationModeClick}
          >
            <img className="menu__item__icon" src={addIcon}/>
            <a>Dodaj przypis</a>
          </li>
          <li className="menu__item clickable">
            <img className="menu__item__icon" src={requestIcon}/>
            <a>Poproś o przypis</a>
          </li>
          <hr className="menu__separator"/>
          <li className="menu__item">
            <img className="menu__item__icon" src={switchOffIcon}/>
            <span>Wyłącz wtyczkę</span>
            <Toggle
              checked={disabledExtension}
              onChange={this.handleDisabledExtensionChange}
            />
          </li>
          <li className="menu__sub-item">
            <span>tylko na tej stronie</span>
            <Toggle
              checked={isDisabled}
              onChange={this.handleDisabledPageChange}
            />
          </li>
          <hr className="menu__separator"/>
          <div className="cta-container">
            <button className="cta-button">Daj znać, co myślisz</button>
          </div>
        </ul>
      </div>
    );
  }
}
