import React, {Component} from 'react';
import annotationTypes from '../consts.js'

export default class AnnotationViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialView: true
            //TODO KG use also component's state to keep feedback buttons expansion state?
        }
    }

    componentWillReceiveProps() {
        // Set timeout after which edit buttons disappear
        this.setState({initialView: true});
        setTimeout(
            () => this.setState({initialView: false}), 500
        );
    }

    render() {
        return (
            //Analogous to annotator.Viewer.itemTemplate
            <li className="annotator-annotation annotator-item">
                <span className={"annotator-controls " + (this.state.initialView ? "annotator-visible" : "")}>
                    <button type="button"
                            title="Edit"
                            className="annotator-edit"
                            onClick={(e) => this.props.callbacks.onEdit(e, this.props.annotation)}>Edit</button>
                    <button type="button"
                            title="Delete"
                            className="annotator-delete"
                            onClick={(e) => this.props.callbacks.onDelete(e, this.props.annotation)}>Delete</button>
                </span>
                <div>
                    {this.props.annotation.fields.annotationPriority}
                </div>
                <div>
                    {this.props.annotation.fields.comment}
                </div>
                <div>
                    {this.props.annotation.fields.link}
                </div>
                <div>
                    {this.props.annotation.fields.linkTitle}
                </div>
                <div>
                    {this.props.annotation.fields.isLinkOnly}
                </div>
            </li>
        );
    }
}