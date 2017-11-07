import React, { Component } from 'react';

function sliceKeys(dictionary, keys) {
    let result = {};
    keys.forEach(function(key) {
        result[key] = dictionary[key];
    });
    return result;
}

const savedFields = [
    // 'type', TODO
    'comment',
    'link',
    'linkTitle',
    'isLinkOnly'
];

export default class AnnotationForm extends Component {
    constructor(props) {
        super(props);

        this.state = AnnotationForm.stateFromProps(props);

        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    static stateFromProps(props) {
        const fields = props.fields;
        return {
            // type: fields.type || 'NORMAL', TODO
            comment: fields.comment || '',
            link: fields.link || '',
            linkTitle: fields.linkTitle || '',
            isLinkOnly: fields.isLinkOnly || false
        };
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleLinkChange(event) {
        this.setState({link: event.target.value});
    }

    handleLinkTitleChange(event) {
        this.setState({linkTitle: event.target.value});
    }

    handleIsLinkOnlyChange(event) {
        this.setState({isLinkOnly: event.target.value});
    }

    onSave() {
        const fieldsToSave = sliceKeys(this.state, savedFields);
        if(self.state.isLinkOnly) {
            fieldsToSave.comment = '';
        }
        this.props.onSave();
    }

    onCancel() {
        this.props.onCancel();
    }

    componentWillReceiveProps(newProps) {
        this.setState(AnnotationForm.stateFromProps(newProps));
    }

    render() {

        return (
            <form className="annotator-widget">
                <ul className="annotator-listing">
                    <li>
                        <label>
                          <input
                            type="checkbox"
                            checked={this.state.isLinkOnly}
                            onChange={this.handleIsLinkOnlyChange.bind(this)}
                          />
                            Brak komentarza
                        </label>
                    </li>
                    <li className="annotator-item">
                        <textarea
                            placeholder="Komentarz"
                            value={this.state.comment}
                            onChange={this.handleCommentChange.bind(this)}
                            disabled={this.state.isLinkOnly}
                        {/*TODO hide when isLinkOnly*/}
                        />
                    </li>
                    <li className="annotator-item">
                        <input
                            type="text"
                            placeholder="Link źródła"
                            value={this.state.link}
                            onChange={this.handleLinkChange.bind(this)}
                        />
                    </li>
                    <li className="annotator-item">
                        <input
                            type="text"
                            placeholder="Tytuł źródła"
                            value={this.state.linkTitle}
                            onChange={this.handleLinkTitleChange.bind(this)}
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
