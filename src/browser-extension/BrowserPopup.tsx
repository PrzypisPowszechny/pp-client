import React from 'react';

export default class BrowserPopup extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div className="ui vertical menu pp-popup">
        <div className="item">
            <h4>*Przypis Powszechny</h4>
            </div>
        <div className="item">
            <div className="header">Pomoc</div>
            <div className="menu">
                <a className="item">Jak dodawać przypisy?</a>
            </div>
        </div>
        <div className="item">
            <div className="header">O aplikacji</div>
            <div className="menu">
                <a className="item">Strona na fb</a>
                <a className="item">Dołącz do nas</a>
            </div>
        </div>
        <div className="item">
            <div className="header">Ustawienia</div>
            <div className="large menu">
                <a className="item">Wyłącz wtyczkę</a>
                <a className="item">Odinstaluj</a>
            </div>
        </div>
    </div>
    );
  }
}
