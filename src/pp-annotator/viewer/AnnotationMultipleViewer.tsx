import React from 'react';

import AnnotationViewer, { ICallbacks } from './AnnotationViewer';
import { AnnotationViewModel } from '../annotation';

interface IAnnotationMultipleViewerProps {
  annotations: AnnotationViewModel[];
  callbacks: ICallbacks;
}

export default class AnnotationMultipleViewer extends React.Component<IAnnotationMultipleViewerProps, {}> {
  constructor(props: IAnnotationMultipleViewerProps) {
    super(props);
  }

  renderItems() {
    return this.props.annotations.map(annotation => (
      <AnnotationViewer
        key={annotation.id || 0}
        annotation={annotation}
        callbacks={this.props.callbacks}
      />
    ));
  }

  render() {
    return (
      // The inner part of annotator.Viewer.template
      <ul className="pp-widget annotator-listing">{this.renderItems()}</ul>
    );
  }
}
