import React from 'react';
import BrowserPopup from './BrowserPopup';
import AnnotationList from './annotationList/AnnotationList';
import { selectIsTabInitialized } from '../../common/store/tabs/selectors';
import { connect } from 'react-redux';

export default class BrowserPopupLoadDisplay extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>

      </div>
        );
  }

}
