import React from 'react';
import { AnnotationPriorities } from '../consts';
import {IAnnotationFields, AnnotationViewModel} from '../annotation';

const savedFields = ['priority', 'comment', 'referenceLink', 'referenceLinkTitle'];
import '../../css/editor.scss';

// Add Semantic-ui packages
import 'semantic-ui/dist/semantic.css';
import 'semantic-ui/dist/semantic.js';

export interface IAnnotationFormProps {
  id: number;
  annotation: AnnotationViewModel;
  saveAction(annotation: AnnotationViewModel): any;
  onSave(e: any): any;
  onCancel(e: any): any;
}

export interface IAnnotationFormState extends IAnnotationFields {
  linkFilledIn: boolean;
}

function sliceKeys(dictionary: any, keys: string[]) {
  const result: {
    [x: string]: any;
  } = {};
  keys.forEach(key => {
    result[key] = dictionary[key];
  });
  return result;
}

function getFormState(obj: any) {
  return sliceKeys(obj, savedFields) as IAnnotationFormState;
}

export default class AnnotationForm extends React.Component<
  IAnnotationFormProps,
  Partial<IAnnotationFormState>
> {

  private static stateFromProps(props: IAnnotationFormProps): IAnnotationFormState {
    const annotation = props.annotation;
    return {
      priority: annotation.priority || AnnotationPriorities.NORMAL,
      comment: annotation.comment || '',
      referenceLink: annotation.referenceLink || '',
      referenceLinkTitle: annotation.referenceLinkTitle || '',
      linkFilledIn: !!annotation.referenceLink
    };
  }

  constructor(props: IAnnotationFormProps) {
    super(props);
    this.state = AnnotationForm.stateFromProps(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleReferenceLinkChange = this.handleReferenceLinkChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  public componentWillUpdate(_nextProps: IAnnotationFormProps, nextState: Partial<IAnnotationFormState>) {
    // Whenever referenceLink is empty, linkFilledIn must always be false.
    if(!nextState.referenceLink) {
      nextState.linkFilledIn = false;
      nextState.referenceLinkTitle = '';
    }
  }

  public render() {
      const {
          priority,
          comment,
          referenceLink,
          referenceLinkTitle,
          linkFilledIn
      } = this.state;

    return (
      <div className="pp-widget">
        <div className="pp-editor-head-bar">
            {/*KG todo could probably be neater if done with sth like PriorityButton component*/}
            <button
                className={"pp-editor-priority" + (priority=='NORMAL' ? ' selected' : '')}
                onClick={() => this.setState({priority: 'NORMAL'})}
            >
                przypis
            </button>
          <button
              className={"pp-editor-priority" + (priority=='WARNING' ? ' selected' : '')}
              onClick={() => this.setState({priority: 'WARNING'})}
          >
                przypis
            </button>
          <button
              className={"pp-editor-priority" + (priority=='ALERT' ? ' selected' : '')}
              onClick={() => this.setState({priority: 'ALERT'})}
          >
                przypis
            </button>
          <div className="priority-help">
            <i className="help circle icon"></i>
          </div>
        </div>
        <div
            className="pp-close"
             onClick={(e) => this.onCancel(e)}
        >
          <i className="remove icon"></i>
        </div>
        <div className="editor-input pp-comment">
          <textarea
            name="comment"
            value={comment}
            onChange={this.handleInputChange}
            placeholder="Dodaj treść przypisu"
          />
        </div>
        <div className="pp-bottom-bar">
          <div className="pp-link-form">
            <div className={"editor-input pp-reference-link" + (linkFilledIn ? " annotator-hide" : "")}>
              <input
                type="text"
                name="referenceLink"
                value={referenceLink}
                onChange={this.handleReferenceLinkChange}
                placeholder="Wklej link do źródła"
              />
            </div>
            <div className={"editor-input pp-reference-link-title" + (linkFilledIn ? "" : " annotator-hide")}>
              <span className="pp-link-box">
                <i className="linkify icon"></i>
                <button
                    className="pp-close"
                    onClick={() => {this.setState({referenceLink: ''}); console.log(this.state.referenceLink)}}
                >
                  <i className="remove circle icon"></i>
                </button>
              </span>
              <input
                type="text"
                name="referenceLinkTitle"
                value={referenceLinkTitle}
                onChange={this.handleInputChange}
                placeholder="Wpisz tytuł źródła"
              />
              <div className="link-help">
                <i className="help circle icon"></i>
              </div>
            </div>
          </div>
          <div className="pp-mover-area"></div>
          <div className="pp-controls">
            <button className="pp-cancel" onClick={(e) => this.onCancel(e)}>
              {' '}Anuluj{' '}
            </button>
            <button className="pp-save annotator-focus" onClick={(e) => this.onSave(e)}>
              {' '}Zapisz{' '}
            </button>
          </div>
        </div>
      </div>
    );
  }

  public componentWillReceiveProps(newProps: IAnnotationFormProps) {
    this.setState(AnnotationForm.stateFromProps(newProps));
  }

  private handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;
    const name = target.name;
    this.setState({ [name]: target.value });
  }

  private handleReferenceLinkChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;
    if (target.value.length > 5) {
      this.setState({linkFilledIn: true})
    }
    this.setState({[target.name]: target.value });

  }

  private onSave(event: any) {
    // Copy form fields onto (much larger) view model before executing saveAction
    Object.assign(this.props.annotation, getFormState(this.state));
    const result = this.props.saveAction(this.props.annotation);

    Promise.resolve(result)     // it will work whether result is a Promise or a value
      .then((result) => {
        const errors = result.errors;
        if (errors) {
          //TODO handle form validation messages here

        } else {
          this.props.onSave(event);
        }
      })

  }

  private onCancel(event: any) {
    this.props.onCancel(event);
  }
}
