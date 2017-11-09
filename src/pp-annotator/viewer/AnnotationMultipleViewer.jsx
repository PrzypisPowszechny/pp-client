import React, { Component } from 'react';

import AnnotationViewer from './AnnotationViewer.jsx';

export default class AnnotationMultipleViewer extends Component {
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
