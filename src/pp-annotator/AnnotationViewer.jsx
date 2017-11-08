import React, {Component} from 'react';

export default class AnnotationViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //TODO KG use component's state to keep expanding feedback buttons state?
        }
    }

    render() {
        return (
            //Analogous to annotator.Viewer.itemTemplate
            <li className="annotator-annotation annotator-item">
                <span className="annotator-controls">
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
                    {this.props.annotation.fields.comment}
                </div>
            </li>
        );
    }
}