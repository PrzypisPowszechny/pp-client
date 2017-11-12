import * as React from 'react';

import AnnotationViewer, { ICallbacks }from './AnnotationViewer.jsx';
import IAnnotation from '../i-annotation';

interface IAnnotationMultipleViewerProps {
    annotations: IAnnotation[];
    callbacks: ICallbacks;
}

export default class AnnotationMultipleViewer extends React.Component<IAnnotationMultipleViewerProps, {}> {
    constructor(props) {
        super(props);
    }

    renderItems() {
        return this.props.annotations.map((annotation) =>
            <AnnotationViewer key={annotation.id} annotation={annotation} callbacks={this.props.callbacks} />
        );
    }

    render() {
        return (
            //The inner part of annotator.Viewer.template
            <ul className="annotator-widget annotator-listing">
                {this.renderItems()}
            </ul>
        );
    }
}
