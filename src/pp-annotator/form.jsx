import React, { Component } from 'react';

export default class AnnotationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: props.fields.comment || '',
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    onSave() {
        this.props.onSave({
            comment: this.state.comment,
        });
    }

    onCancel() {
        this.props.onCancel();
    }

    componentWillReceiveProps(newProps) {
        this.setState({comment: newProps.fields.comment || ''});
    }

    render() {
        return (
            <form className="annotator-widget">
                <ul className="annotator-listing">
                    <li className="annotator-item">
                        <textarea
                            placeholder="Komentarz"
                            value={this.state.comment}
                            onChange={this.handleCommentChange}
                        />
                    </li>
                </ul>
                <div className="annotator-controls">
                    {/*
                     TODO I guess it'd better to use buttons here, to avoid problems with href value moving the view to top
                      */}
                    <a href="#" className="annotator-cancel" onClick={this.props.onCancel}> Anuluj </a>
                    <a href="#" className="annotator-save annotator-focus" onClick={this.onSave}> Zapisz </a>
                </div>
            </form>
        );
    }
}
