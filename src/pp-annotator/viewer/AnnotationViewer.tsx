import React from 'react';
import {AnnotationViewModel} from "../annotation";
import '../../css/viewer.scss'

// Add Semantic-ui packages
import 'semantic-ui/dist/semantic.css';
import 'semantic-ui/dist/semantic.js';

interface IAnnotatorViewerProps {
    key: number;
    annotation: AnnotationViewModel;
    callbacks: ICallbacks;
}

interface IAnnotatorViewerState {
    initialView: boolean;
}

export interface ICallbacks {
    onEdit(e: React.MouseEvent<HTMLButtonElement>, annotation: AnnotationViewModel): void;
    onDelete(e: React.MouseEvent<HTMLButtonElement>, annotation: AnnotationViewModel): void;
}

export default class AnnotationViewer extends React.Component<
    IAnnotatorViewerProps,
    IAnnotatorViewerState
    > {
    constructor(props: IAnnotatorViewerProps) {
        super(props);

        this.state = {
            initialView: true
            // TODO KG use also component's state to keep feedback buttons expansion state?
        };
    }

    public componentWillReceiveProps() {
        // Set timeout after which edit buttons disappear
        this.setState({initialView: true});
        setTimeout(() => this.setState({initialView: false}), 500);
    }

    public render() {
        const {
            priority,
            comment,
            referenceLink,
            referenceLinkTitle
        } = this.props.annotation;

        return (
            <div className="pp-annotation pp-item">
                <div className="pp-view-head-bar">
                    <div className="pp-view-comment-priority">
                        {priority}
                    </div>

                    <div className="pp-view-comment-date">
                        01.01.1999
                    </div>

                    <div className={"pp-controls " + (this.state.initialView ? "pp-visible" : "")}>
                        <div className="ui icon basic mini buttons">
                            <button type="button"
                                    title="Edit"
                                    className="pp-edit ui button"
                                    onClick={(e) => this.props.callbacks.onEdit(e, this.props.annotation)}>
                                <i className="edit icon"></i>
                            </button>
                            <button type="button"
                                    title="Delete"
                                    className="pp-delete ui button"
                                    onClick={(e) => this.props.callbacks.onDelete(e, this.props.annotation)}>
                                <i className="trash icon"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pp-view-comment">
                    {comment}
                </div>

                <div className="pp-view-link-bar">
			<span className="pp-view-link">
			<a href={referenceLink}>
				{referenceLinkTitle}
			</a>
			</span>
                </div>
            </div>
        );
    }
}
