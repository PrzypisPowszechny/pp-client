import React, { ChangeEvent } from 'react';

import addIcon from '../../../assets/pp-add-icon.svg';
import requestIcon from '../../../assets/pp-request-icon.svg';
import switchOffIcon from '../../../assets/pp-switch-off-icon.svg';

import Toggle from './toggle/toggle';
import chromeStorage from 'chrome-storage';
import * as chromeKeys from 'chrome-storage/keys';

declare const chrome: any;

interface IBrowserPopupState {
  annotationMode: boolean;
  disabledExtension: boolean;
  disabledPage: boolean;
}

export default class BrowserPopup extends React.Component<{}, Partial<IBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {
      annotationMode: false,
      disabledExtension: false,
      disabledPage: false,
    };
  }

  componentDidMount() {
    /* Use data from chrome storage to update popup state
     * It is assumed that there are no other sources of data;
     * For more sources of data, resort to a local popup Redux store or a global background page Redux store
     */

    chromeStorage.get([
      chromeKeys.ANNOTATION_MODE,
      chromeKeys.DISABLED_EXTENSION,
      chromeKeys.DISABLED_PAGES,
    ], (result) => {
      // TODO normalize the URL
      const isDisabled = (result[chromeKeys.DISABLED_PAGES] || []).indexOf(window.location.href) !== -1;

      this.setState({
        annotationMode: result[chromeKeys.ANNOTATION_MODE] || false,
        disabledExtension: result[chromeKeys.DISABLED_EXTENSION] || false,
        disabledPage: isDisabled,
      });
    });
  }

  handleAnnotationModeClick = (e) => {
    this.setState({ annotationMode: true });
    // todo update storage
    window.close();
  }

  handleDisabledExtensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ disabledExtension: e.target.checked });
    // todo update storage
  }

  handleDisabledPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ disabledPage: e.target.checked });
    // todo update storage
    // todo normalize the URL before saving
    // const disabledPages = new Set(this.state.disabledPages);
    // disabledPages.add(window.location.href);
  }

  render() {
    const {
      annotationMode,
      disabledExtension,
      disabledPage,
    } = this.state;

    return (
      <div className="pp-popup">
        <ul className="menu">
          {!annotationMode &&
          <li className="menu__item clickable" onClick={this.handleAnnotationModeClick}>
            <img className="menu__item__icon" src={addIcon}/>
            <a>Dodaj przypis</a>
          </li>
          }
          <li className="menu__item clickable">
            <img className="menu__item__icon" src={requestIcon}/>
            <a>Poproś o przypis</a>
          </li>
          <hr className="menu__separator"/>
          <li className="menu__item">
            <img className="menu__item__icon" src={switchOffIcon}/>
            {/*<span>Wyłącz wtyczkę</span>*/}
            <Toggle
              checked={disabledExtension}
              onChange={this.handleDisabledExtensionChange}
            />
          </li>
          <li className="menu__sub-item">
            <span>tylko na tej stronie</span>
            <Toggle
              checked={disabledPage}
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
