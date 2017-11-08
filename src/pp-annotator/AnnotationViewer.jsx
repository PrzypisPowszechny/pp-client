import React, {Component} from 'react';

export default class AnnotationViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //TODO KG use component's state to keep expanding feedback buttons state?
        }
    }

    render() {
        console.log(this.props);
        return (
            //Analogous to annotator.Viewer.itemTemplate
            <li className="annotator-annotation annotator-item">
                <span className="annotator-controls">

                    <button type="button"
                            title="Edit"
                            className="annotator-edit">Edit</button>
                    <button type="button"
                            title="Delete"
                            className="annotator-delete">Delete</button>
                </span>
                <div>
                    {this.props.annotation.fields.comment}
                </div>
            </li>
        );
    }
}