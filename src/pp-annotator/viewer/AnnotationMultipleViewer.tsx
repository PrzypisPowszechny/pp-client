import * as React from 'react';

import IAnnotation from '../i-annotation';
import AnnotationViewer, { ICallbacks } from './AnnotationViewer';

interface IAnnotationMultipleViewerProps {
  annotations: IAnnotation[];
  callbacks: ICallbacks;
}

export default class AnnotationMultipleViewer extends React.Component<
  IAnnotationMultipleViewerProps,
  {}
> {
  constructor(props: IAnnotationMultipleViewerProps) {
    super(props);
  }

  public renderItems() {
    return this.props.annotations.map(annotation => (
      <AnnotationViewer
        key={annotation.id || 0}
        annotation={annotation}
        callbacks={this.props.callbacks}
      />
    ));
  }

  public render() {
    return (
      // The inner part of annotator.Viewer.template
      <ul className="annotator-widget annotator-listing">{this.renderItems()}</ul>
    );
  }
}
