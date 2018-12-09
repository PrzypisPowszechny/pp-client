import React, { ChangeEvent } from 'react';

import { Icon } from 'react-icons-kit';
import { ic_add_circle } from 'react-icons-kit/md/ic_add_circle';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { ic_block } from 'react-icons-kit/md/ic_block';
import { ic_home } from 'react-icons-kit/md/ic_home';

import { standardizeUrlForPageSettings } from 'common/url';
import Toggle from './toggle/toggle';
import chromeStorage from 'common/chrome-storage';
import * as chromeKeys from 'common/chrome-storage/keys';
import _filter from 'lodash/filter';
import classNames from 'classnames';
import ppGA from 'common/pp-ga/index';
import axios from 'axios';
import { getCurrentTabUrl } from '../utils';
import { saveAnnotationRequest } from '../../common/api/utils';

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
      ppGA.annotationAddingModeInited();
    }
  }

  handleAnnotationRequestClick = (e) => {
    getCurrentTabUrl().then((url) => {
      saveAnnotationRequest({ url }).then((response) => {
        // TODO notify
        console.log('annotation request sent!');
      });
    });
    ppGA.annotationRequestLinkClicked(this.state.currentTabUrl);
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isDisabledNewValue = e.target.checked;
    this.setState({ isExtensionDisabled: isDisabledNewValue });
    chromeStorage.set({ [chromeKeys.DISABLED_EXTENSION]: isDisabledNewValue });
    if (isDisabledNewValue) {
      ppGA.extensionDisabledOnAllSites(this.state.currentTabUrl);
    } else {
      ppGA.extensionEnabledOnAllSites(this.state.currentTabUrl);
    }
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
      ppGA.extensionDisabledOnSite(currentTabUrl);
    } else {
      newDisabledPages = _filter(disabledPages, url => url !== currentTabUrl);
      ppGA.extensionEnabledOnSite(currentTabUrl);
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

  handleReportButtonClick = () => {
    ppGA.reportPopupClicked(this.state.currentTabUrl);
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
          <div className="menu-top">
            <div className="menu-logo"/>
            <a href="https://przypispowszechny.pl/site/about/" target="_blank">
              <Icon className="icon" icon={ic_home} size={20} />
            </a>
          </div>
          <hr className="menu-separator"/>
          <li
            className={classNames('menu-item', 'clickable', 'primary',
              { disabled: isExtensionDisabled || isCurrentPageDisabled },
              { active: isAnnotationMode })}
            onClick={this.handleAnnotationModeClick}
          >
            <Icon className="icon" icon={ic_add_circle} size={25}/>
            {isAnnotationMode ?
              <span className="active-mode">Dodajesz przypis </span>
              : <span>Dodaj przypis</span>
            }
            <p className="caption">
              Dodaj przypis, aby podzielić się wartościową informacją ze społecznością *PP
            </p>
          </li>
          <li
            className={classNames('menu-item', 'clickable')}
            onClick={this.handleAnnotationRequestClick}
          >
            <Icon className="icon" icon={ic_live_help} size={25}/>
            <span>Poproś o przypis</span>
            <p className="caption">Możesz poprosić o sprawdzenie wybranego fragmentu artykułu.
              Twoje zgłoszenie zostanie przekazane do redaktorów Demagoga.
            </p>
          </li>
          <hr className="menu-separator"/>
          <li className="menu-item">
            <Icon className="icon" icon={ic_block} size={25}/>
            <span>Wyłącz przypisy</span>
          </li>
          <li className="menu-subitem">
            <span className={classNames({ negativeActive: isCurrentPageDisabled })}>na tej stronie</span>
            <Toggle
              checked={isCurrentPageDisabled}
              onChange={this.handleDisabledPageChange}
            />
          </li>
          <li className="menu-subitem">
            <span className={classNames({ negativeActive: isExtensionDisabled })}>wszędzie</span>
            <Toggle
              checked={isExtensionDisabled}
              onChange={this.handleDisabledExtensionChange}
            />
          </li>
          <hr className="menu-separator"/>
          <div className="menu-bottom">
            <p className="menu-header">Pomóż nam ulepszać Przypis Powszechny</p>
            <p className="menu-text">Coś nie działa? Uważasz, że czegoś brakuje? Coś Cię zirytowało?</p>
            <a className="cta-Button" href="https://przypispowszechny.pl/site/report/" target="_blank" onClick={this.handleReportButtonClick}>
              Powiedz nam o tym!
            </a>
          </div>
        </ul>
      </div>
    );
  }
}
