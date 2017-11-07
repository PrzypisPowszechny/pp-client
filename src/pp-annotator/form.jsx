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

        this.handleInputChange = this.handleInputChange.bind(this);
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

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({[name]: target.value});
    }


    handleIsLinkOnlyChange(event) {
        this.setState({isLinkOnly: event.target.checked});
    }

    onSave() {
        const fieldsToSave = sliceKeys(this.state, savedFields);
        if(this.state.isLinkOnly) {
            fieldsToSave.comment = '';
        }
        this.props.onSave(fieldsToSave);
    }

    onCancel() {
        this.props.onCancel();
    }

    componentWillReceiveProps(newProps) {
        this.setState(AnnotationForm.stateFromProps(newProps));
    }


    render() {
        /*TODO KG hide comment when isLinkOnly*/
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
                            name="comment"
                            value={this.state.comment}
                            onChange={this.handleInputChange}
                            disabled={this.state.isLinkOnly}
                            placeholder="Komentarz"
                        />
                    </li>
                    <li className="annotator-item">
                        <input
                            type="text"
                            name="link"
                            value={this.state.link}
                            onChange={this.handleInputChange}
                            placeholder="Link źródła"
                        />
                    </li>
                    <li className="annotator-item">
                        <input
                            type="text"
                            name="linkTitle"
                            value={this.state.linkTitle}
                            onChange={this.handleInputChange}
                            placeholder="Tytuł źródła"
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
