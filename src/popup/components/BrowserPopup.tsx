import React, { ChangeEvent } from 'react';

import { Icon } from 'react-icons-kit';
import { ic_add_circle } from 'react-icons-kit/md/ic_add_circle';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { ic_block } from 'react-icons-kit/md/ic_block';
import { ic_home } from 'react-icons-kit/md/ic_home';

import { standardizeUrlForPageSettings } from 'common/url';
import Toggle from './toggle/Toggle';
import chromeStorage, { turnOnRequestMode } from 'common/chrome-storage';
import * as chromeKeys from 'common/chrome-storage/keys';
import _filter from 'lodash/filter';
import classNames from 'classnames';
import ppGA from 'common/pp-ga/index';
import { AnnotationAPIModel } from 'common/api/annotations';
import AnnotationSummary from './annotationSummary/AnnotationSummary';
import { PopupPages } from './BrowserPopupNavigator';
import '../css/popup.scss';

export interface IBrowserPopupProps {
  onAnnotationRequestSelect: () => void;
  onPageChange: (PopupPages) => void;
}

interface IBrowserPopupState {
  isLoading: boolean;
  currentStandardizedTabUrl: string;
  annotationModePages: string[];
  requestModePages: string[];
  isExtensionDisabled: boolean;
  disabledPages: string[];
}

export default class BrowserPopup extends React.Component<Partial<IBrowserPopupProps>,
  Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      currentStandardizedTabUrl: null,
      annotationModePages: [],
      requestModePages: [],
      isExtensionDisabled: false,
      disabledPages: [],
    };
  }

  loadStateFromAppModes() {
    /* Use data from chrome storage to update popup state
     * It is assumed that there are no other sources of data;
     * In the future:
     *   for more sources of data, resort to a local popup Redux store or a global background page Redux store
     */
    if (this.state.isLoading) {
      chromeStorage.get([
        chromeKeys.ANNOTATION_MODE_PAGES,
        chromeKeys.REQUEST_MODE_PAGES,
        chromeKeys.DISABLED_EXTENSION,
        chromeKeys.DISABLED_PAGES,
      ], (result) => {
        this.setState({
          isLoading: false,
          annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
          requestModePages: result[chromeKeys.REQUEST_MODE_PAGES] || [],
          isExtensionDisabled: result[chromeKeys.DISABLED_EXTENSION] || false,
          disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
        });
      });
    }

  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      this.setState({ currentStandardizedTabUrl: standardizeUrlForPageSettings(tab.url) });
    });

    this.loadStateFromAppModes();
  }

  componentDidUpdate() {
    this.loadStateFromAppModes();
  }

  isExtensionDisabledForCurrentTab() {
    return (this.state.disabledPages || []).indexOf(this.state.currentStandardizedTabUrl) !== -1;
  }

  isAnnotationModeForCurrentTab() {
    return (this.state.annotationModePages || []).indexOf(this.state.currentStandardizedTabUrl) !== -1;
  }

  isRequestModeForCurrentTab() {
    return (this.state.requestModePages || []).indexOf(this.state.currentStandardizedTabUrl) !== -1;
  }

  handleFullAnnotationViewClick = (e) => {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(PopupPages.annotationList);
    }
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
      requestModePages,
      annotationModePages,
      currentStandardizedTabUrl,
    } = this.state;

    const isAnnotationMode = this.isAnnotationModeForCurrentTab();
    if (!isAnnotationMode) {
      let newAnnotationModePages;
      newAnnotationModePages = [...annotationModePages, currentStandardizedTabUrl];

      // switch off request mode
      let newRequestModePages = requestModePages;
      if (this.isRequestModeForCurrentTab()) {
        newRequestModePages = _filter(requestModePages, url => url !== currentStandardizedTabUrl);
      }

      this.setState({ annotationModePages: newAnnotationModePages, requestModePages: newRequestModePages });
      chromeStorage.set({
        [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
        [chromeKeys.REQUEST_MODE_PAGES]: newRequestModePages
      });
      window.close();
      ppGA.annotationAddingModeInited();
    }
  }

  handleAnnotationRequestClick = (e) => {
    const {
      currentStandardizedTabUrl,
    } = this.state;

    const isRequestMode = this.isRequestModeForCurrentTab();
    if (!isRequestMode) {
      turnOnRequestMode(this.state, currentStandardizedTabUrl);
      window.close();
      ppGA.annotationRequestLinkClicked(this.state.currentStandardizedTabUrl);
    }
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isDisabledNewValue = e.target.checked;
    this.setState({ isExtensionDisabled: isDisabledNewValue });
    chromeStorage.set({ [chromeKeys.DISABLED_EXTENSION]: isDisabledNewValue });
    if (isDisabledNewValue) {
      ppGA.extensionDisabledOnAllSites(this.state.currentStandardizedTabUrl);
    } else {
      ppGA.extensionEnabledOnAllSites(this.state.currentStandardizedTabUrl);
    }
  }

  handleDisabledPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const {
      disabledPages,
      currentStandardizedTabUrl,
      annotationModePages,
      requestModePages,
    } = this.state;

    let newDisabledPages;
    if (checked) {
      newDisabledPages = [...disabledPages, currentStandardizedTabUrl];
      ppGA.extensionDisabledOnSite(currentStandardizedTabUrl);
    } else {
      newDisabledPages = _filter(disabledPages, url => url !== currentStandardizedTabUrl);
      ppGA.extensionEnabledOnSite(currentStandardizedTabUrl);
    }
    // Permanently turn off the annotation mode for the disabled pages
    const newAnnotationModePages = _filter(annotationModePages, url => !newDisabledPages.includes(url));
    const newRequestnModePages = _filter(requestModePages, url => !newDisabledPages.includes(url));

    this.setState({
      disabledPages: newDisabledPages,
      annotationModePages: newAnnotationModePages,
      requestModePages: newRequestnModePages,
    });
    chromeStorage.set({
      [chromeKeys.DISABLED_PAGES]: newDisabledPages,
      [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
      [chromeKeys.REQUEST_MODE_PAGES]: newRequestnModePages,
    });
  }

  handleReportButtonClick = () => {
    ppGA.reportPopupClicked(this.state.currentStandardizedTabUrl);
  }

  render() {
    const {
      isLoading,
      isExtensionDisabled,
    } = this.state;

    const isCurrentPageDisabled = this.isExtensionDisabledForCurrentTab();
    const isAnnotationMode = this.isAnnotationModeForCurrentTab();
    const isRequestMode = this.isRequestModeForCurrentTab();

    if (isLoading) {
      // Do not display the page already, when loading; otherwise we'll always see the toggle transition...
      return null;
    }

    return (
      <div className="pp-popup">
        <ul className="menu">
          <div className="menu-top">
            <div className="menu-logo"/>
            <a href={`${PPSettings.SITE_URL}/about/`} target="_blank">
              <Icon className="icon" icon={ic_home} size={20}/>
            </a>
          </div>
          <hr className="menu-separator"/>
          <AnnotationSummary onFullViewClick={this.handleFullAnnotationViewClick}/>
          <hr className="menu-separator"/>
          <li
            className={classNames('menu-item', 'clickable', 'primary',
              { disabled: isExtensionDisabled || isCurrentPageDisabled },
              { active: isAnnotationMode })}
            onClick={this.handleAnnotationModeClick}
          >
            <Icon className="icon" icon={ic_add_circle} size={25}/>
            {isAnnotationMode ?
              <span>Dodajesz przypis </span>
              : <span>Dodaj przypis</span>
            }
            <p className="caption">
              Dodaj przypis, aby podzielić się wartościową informacją ze społecznością *PP
            </p>
          </li>
          <li
            className={classNames('menu-item', 'clickable',
              { disabled: isExtensionDisabled || isCurrentPageDisabled },
              { active: isRequestMode })}
            onClick={this.handleAnnotationRequestClick}
          >
            <Icon className="icon" icon={ic_live_help} size={25}/>
            {isRequestMode ?
              <span>Zgłaszasz prośbę o przypis </span>
              : <span>Poproś o przypis</span>
            }
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
            <a
              className="cta-Button"
              href={`${PPSettings.SITE_URL}/report/`}
              target="_blank"
              onClick={this.handleReportButtonClick}
            >
              Powiedz nam o tym!
            </a>
          </div>
        </ul>
      </div>
    )
      ;
  }
}
