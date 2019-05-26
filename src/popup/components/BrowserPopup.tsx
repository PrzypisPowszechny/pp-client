import React, { ChangeEvent } from 'react';
import { send } from 'react-icons-kit/fa/send';
import { Icon } from 'react-icons-kit/Icon';
import { ic_add_circle } from 'react-icons-kit/md/ic_add_circle';
import { ic_block } from 'react-icons-kit/md/ic_block';
import { ic_home } from 'react-icons-kit/md/ic_home';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { connect } from 'react-redux';

import classNames from 'classnames';
import _filter from 'lodash/filter';

import { UserRoles } from 'common/api/user';
import * as chromeKeys from 'common/chrome-storage/keys';
import ppGa from 'common/pp-ga/index';
import { selectUser } from 'common/store/storage/selectors';
import { IUserState } from 'common/store/storage/types';
import { selectRealTab, selectTab } from 'common/store/tabs/selectors';
import { IAnnotationRequestFormData, IAnnotationRequestFormState } from 'common/store/tabs/tab/widgets';
import { hideAnnotationRequestForm, showAnnotationRequestForm } from 'common/store/tabs/tab/widgets/actions';
import { standardizeUrlForPageSettings } from 'common/url';
import Button from 'content-scripts/components/elements/Button/Button';

import AnnotationSummary from './annotationSummary/AnnotationSummary';
import { PopupPages } from './BrowserPopupNavigator';
import LogoutPanel from './LogoutPanel';
import Toggle from './toggle/Toggle';

import {
  PopupAnnotationRequestLocationData,
  selectAnnotationRequestLocations,
} from '../../common/store/tabs/tab/annotationRequests/selectors';
import { AnnotationRequestsStage } from '../../common/store/tabs/tab/annotationRequests/types';
import {
  PopupAnnotationLocationData,
  selectAnnotationLocations,
} from '../../common/store/tabs/tab/annotations/selectors';
import { AnnotationsStage } from '../../common/store/tabs/tab/annotations/types';
import { ITabInfoState } from '../../common/store/tabs/tab/tabInfo';
import '../css/popup.scss';

export interface IBrowserPopupProps {
  user: IUserState;
  tabInfo: ITabInfoState;
  annotations: PopupAnnotationLocationData;
  annotationRequests: PopupAnnotationRequestLocationData;
  annotationRequestForm: IAnnotationRequestFormState;

  debugIsPopupEmulated: boolean;

  hideAnnotationRequestForm: () => void;
  showAnnotationRequestForm: (initialData: Partial<IAnnotationRequestFormData>) => void;

  // React callbacks
  onPageChange: (PopupPages) => void;
}

interface IBrowserPopupState {
  isLoading: boolean;
  currentStandardizedTabUrl: string;
  annotationModePages: string[];
  isExtensionDisabled: boolean;
  disabledPages: string[];
}

/*
 * Currently popup uses data both directly from chrome storage and from redux store
 * TODO: only use data from redux store
 */
@connect(
  state => ({
    user: selectUser(state),
    tabInfo: selectTab(state).tabInfo,
    annotations: selectAnnotationLocations(state),
    annotationRequests: selectAnnotationRequestLocations(state),
    annotationRequestForm: selectTab(state).widgets.annotationRequestForm,

    debugIsPopupEmulated: selectRealTab(state).popupInfo.isEmulated,
  }),
  {
    showAnnotationRequestForm,
    hideAnnotationRequestForm,
  },
)
export default class BrowserPopup extends React.Component<Partial<IBrowserPopupProps>,
  Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: true,
      currentStandardizedTabUrl: null,
      annotationModePages: [],
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
      chrome.storage.local.get([
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
    this.setState({ currentStandardizedTabUrl: standardizeUrlForPageSettings(this.props.tabInfo.currentUrl) });
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

  handleFullAnnotationViewClick = (e) => {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(PopupPages.annotationList);
    }
    ppGa.annotationSummaryClicked({ location: this.state.currentStandardizedTabUrl });
  }

  /*
   * ON POPUP STATE PERSISTENCE
   * We need to both update the storage and the local state
   * - storage, because we need to communicate changes to other parts of the application
   * - state, because there is no other clean method to ensure state continuity, so we can have interface transitions
   * This method of communication with content scripts in fact proves cumbersome;
   * we should move more and more to the global redux store
   */
  handleAnnotationModeClick = (e) => {
    const {
      annotationModePages,
      currentStandardizedTabUrl,
    } = this.state;

    const isAnnotationMode = this.isAnnotationModeForCurrentTab();
    if (!isAnnotationMode && this.isAnnotationButtonEnabled()) {
      let newAnnotationModePages;
      newAnnotationModePages = [...annotationModePages, currentStandardizedTabUrl];

      // switch off request mode
      this.props.hideAnnotationRequestForm();

      this.setState({ annotationModePages: newAnnotationModePages });
      chrome.storage.local.set({
        [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
      });
      ppGa.annotationAddingModeInited({ location: currentStandardizedTabUrl });
      if (!this.props.debugIsPopupEmulated) {
        window.close();
      }
    }
  }

  isAnnotationButtonEnabled = () => {
    const {
      isExtensionDisabled,
    } = this.state;
    const {
      tabInfo: { contentScriptWontLoad },
      annotations: { stage },
    } = this.props;
    const isCurrentPageDisabled = this.isExtensionDisabledForCurrentTab();
    return !isExtensionDisabled && !isCurrentPageDisabled
      && !contentScriptWontLoad && (stage === AnnotationsStage.located);
  }

  handleAnnotationRequestClick = (e) => {
    const { visible } = this.props.annotationRequestForm;
    if (!visible && this.isAnnotationRequestButtonEnabled()) {
      this.props.showAnnotationRequestForm({});
      ppGa.annotationRequestFormOpened('popup', true, { location: this.state.currentStandardizedTabUrl });
      if (!this.props.debugIsPopupEmulated) {
        window.close();
      }
    }
  }

  isAnnotationRequestButtonEnabled = () => {
    const {
      isExtensionDisabled,
    } = this.state;
    const {
      tabInfo: { contentScriptWontLoad },
      annotationRequests: { stage },
    } = this.props;

    const isCurrentPageDisabled = this.isExtensionDisabledForCurrentTab();
    return !isExtensionDisabled && !isCurrentPageDisabled
      && !contentScriptWontLoad && (stage === AnnotationRequestsStage.located);
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isDisabledNewValue = e.target.checked;
    this.setState({ isExtensionDisabled: isDisabledNewValue });
    chrome.storage.local.set({ [chromeKeys.DISABLED_EXTENSION]: isDisabledNewValue });
    if (isDisabledNewValue) {
      ppGa.extensionDisabledOnAllSites({ location: this.state.currentStandardizedTabUrl });
    } else {
      ppGa.extensionEnabledOnAllSites({ location: this.state.currentStandardizedTabUrl });
    }
  }

  handleDisabledPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const {
      disabledPages,
      currentStandardizedTabUrl,
      annotationModePages,
    } = this.state;

    let newDisabledPages;
    if (checked) {
      newDisabledPages = [...disabledPages, currentStandardizedTabUrl];
      ppGa.extensionDisabledOnSite({ location: currentStandardizedTabUrl });
    } else {
      newDisabledPages = _filter(disabledPages, url => url !== currentStandardizedTabUrl);
      ppGa.extensionEnabledOnSite({ location: currentStandardizedTabUrl });
    }
    // Permanently turn off the annotation mode for the disabled pages
    const newAnnotationModePages = _filter(annotationModePages, url => !newDisabledPages.includes(url));
    this.props.hideAnnotationRequestForm();

    this.setState({
      disabledPages: newDisabledPages,
      annotationModePages: newAnnotationModePages,
    });
    chrome.storage.local.set({
      [chromeKeys.DISABLED_PAGES]: newDisabledPages,
      [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
    });
  }

  handleReportButtonClick = () => {
    window.open(`${PPSettings.SITE_URL}/report/`, '_blank');
    ppGa.extensionReportButtonClicked({ location: this.state.currentStandardizedTabUrl });
  }

  renderFeatureButtons() {
    const isAnnotationRequestFormOpen = Boolean(this.props.annotationRequestForm.visible);
    const isAnnotationFormOpen = this.isAnnotationModeForCurrentTab();

    return (
      <>
        {this.props.user.userRole === UserRoles.editor &&
        <li
          className={classNames('menu-item', 'clickable', 'primary',
            { disabled: !this.isAnnotationButtonEnabled() },
            { active: isAnnotationFormOpen })}
          onClick={this.handleAnnotationModeClick}
        >
          <Icon className="icon" icon={ic_add_circle} size={25}/>
          {isAnnotationFormOpen ?
            <span>Dodajesz przypis </span>
            : <span>Dodaj przypis</span>
          }
          <p className="caption">
            Dodaj przypis, aby podzielić się wartościową informacją ze społecznością *PP
          </p>
        </li>
        }

        <li
          className={classNames('menu-item', 'clickable',
            { disabled: !this.isAnnotationRequestButtonEnabled() },
            { active: isAnnotationRequestFormOpen })}
          onClick={this.handleAnnotationRequestClick}
        >
          <Icon className="icon" icon={ic_live_help} size={25}/>
          {isAnnotationRequestFormOpen ?
            <span>Zgłaszasz prośbę o przypis </span>
            : <span>Poproś o przypis</span>
          }
          <p className="caption">Możesz poprosić o sprawdzenie wybranego fragmentu artykułu.
            Twoje zgłoszenie zostanie przekazane do redaktorów Demagoga.
          </p>
        </li>
        <hr className="menu-separator"/>
      </>
    );
  }

  render() {
    const {
      isLoading,
      isExtensionDisabled,
    } = this.state;

    const {
      isSupported,
    } = this.props.tabInfo;

    const isCurrentPageDisabled = this.isExtensionDisabledForCurrentTab();

    if (isLoading) {
      // Do not display the page already, when loading; otherwise we'll always see the toggle transition...
      return null;
    }

    return (
      // todo move top container to outer component
      <div className="pp-ui pp-popup">
        <div className="popup-content">
          <ul className="menu">
            <div className="menu-top">
              <div className="menu-logo"/>
              <a href={`${PPSettings.SITE_URL}/about/`} target="_blank">
                <Icon className="icon" icon={ic_home} size={20}/>
              </a>
            </div>
            <AnnotationSummary onFullViewClick={this.handleFullAnnotationViewClick}/>

            {isSupported && this.renderFeatureButtons()}

            <li className="menu-item">
              <Icon className="icon" icon={ic_block} size={25}/>
              <span>Wyłącz przypisy</span>
            </li>

            {isSupported &&
            <li className="menu-subitem">
              <span className={classNames({ negativeActive: isCurrentPageDisabled })}>na tej stronie</span>
              <Toggle
                checked={isCurrentPageDisabled}
                onChange={this.handleDisabledPageChange}
              />
            </li>
            }
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
              <p className="menu-text">Coś nie działa? Uważasz, że czegoś brakuje?</p>
              <Button
                // className="cta-Button"
                iconBefore={<Icon icon={send} size={14}/>}
                appearance="link"
                onClick={this.handleReportButtonClick}
              >
                Daj znać, co myślisz
              </Button>
            </div>
          </ul>
          {/* temporary location */}
          <LogoutPanel/>
        </div>
      </div>
    )
      ;
  }
}
