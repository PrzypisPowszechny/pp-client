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
            <div className="pp-annotation pp-item">
                <div className={"pp-controls " + (this.state.initialView ? "pp-visible" : "")}>
                    <button type="button"
                            title="Edit"
                            className="pp-edit"
                            onClick={(e) => this.props.callbacks.onEdit(e, this.props.annotation)}>Edit</button>
                    <button type="button"
                            title="Delete"
                            className="pp-delete"
                            onClick={(e) => this.props.callbacks.onDelete(e, this.props.annotation)}>Delete</button>
                </div>

		<div className="pp-view-head-bar">
                <div className="pp-view-comment-priority">
                    {this.props.annotation.fields.annotationPriority}
                </div>
		<div className="pp-view-comment-date">
			01.01.1999
		</div>
		</div>

                <div className="pp-view-comment">
                    {this.props.annotation.fields.comment}
                </div>

		<div className="pp-view-link-bar">
			<span className="pp-view-link">
			<a href={this.props.annotation.fields.link}>
				{this.props.annotation.fields.linkTitle}
			</a>
			</span>
		</div>
                <div>
                    {this.props.annotation.fields.isLinkOnly}
                </div>
            </div>
        );
    }
}
