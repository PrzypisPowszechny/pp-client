import React from 'react';
import {render} from 'react-dom';
import ReactDOM from 'react-dom';
import annotator from 'annotator';


var $ = annotator.util.$;

export default class AnnotationForm extends React.Component {

    constructor(props) {
        super();
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

    onSave(event) {
        this.props.onSave({
                comment: this.state.comment
        });
    }

    onCancel(event) {
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
                        <textarea placeholder="Komentarz" value={this.state.comment} onChange={this.handleCommentChange}/>
                    </li>
                </ul>
                <div className="annotator-controls">
                    <a href="#cancel" className="annotator-cancel" onClick={this.props.onCancel}> Anuluj </a>
                    <a href="#save" className="annotator-save annotator-focus" onClick={this.onSave}> Zapisz </a>
                 </div>
            </form>
        );
    }
}
