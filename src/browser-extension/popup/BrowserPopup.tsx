import React from 'react';

import addIcon from '../../../assets/pp-add-icon.svg';
import requestIcon from '../../../assets/pp-request-icon.svg';
import switchOffIcon from '../../../assets/pp-switch-off-icon.svg';

import Toggle from './toggle/toggle.tsx'

declare const chrome: any;

export default class BrowserPopup extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div className="pp-popup">
        <ul className="menu">
          <li className="menu__item clickable">
            <img className="menu__item__icon" src={addIcon}/>
            <a>Dodaj przypis</a>
          </li>
          <li className="menu__item clickable">
            <img className="menu__item__icon" src={requestIcon}/>
            <a>Poproś o przypis</a>
          </li>
          <hr className="menu__separator" />
          <li className="menu__item">
            <img className="menu__item__icon" src={switchOffIcon}/>
            <span>Wyłącz wtyczkę</span>
            <Toggle />
          </li>
          <li className="menu__sub-item">
            <span>tylko na tej stronie</span>
            <Toggle />
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
