import React from 'react';

import { AnnotationViewModel } from '../annotation';
import ViewerContentItem, { ICallbacks } from './ViewerContentItem';

interface IViewerContentProps {
  annotations: AnnotationViewModel[];
  callbacks: ICallbacks;
}

export default class ViewerContent extends React.Component<IViewerContentProps, {}> {
  constructor(props: IViewerContentProps) {
    super(props);
  }

  renderItems() {
    return this.props.annotations.map(annotation => (
      <ViewerContentItem
        key={annotation.id || 0}
        annotation={annotation}
        callbacks={this.props.callbacks}
      />
    ));
  }

  render() {
    return (
      <ul className="pp-widget annotator-listing">
        {this.renderItems()}
      </ul>
    );
  }
}
