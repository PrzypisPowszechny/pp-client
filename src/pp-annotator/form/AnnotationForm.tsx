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

export type IAnnotationFormState = IAnnotationFields;

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
    };
  }

  constructor(props: IAnnotationFormProps) {
    super(props);
    this.state = AnnotationForm.stateFromProps(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  public render() {
      const {
          priority,
          comment,
          referenceLink,
          referenceLinkTitle
      } = this.state;

    return (
      <div className="pp-widget">
        <div className="pp-editor-head-bar">
            <div className={"pp-editor-priority" + (priority=='NORMAL' ? ' selected' : '')}>
                przypis
            </div>
          <div className={"pp-editor-priority" + (priority=='WARNING' ? ' selected' : '')}>
                przypis
            </div>
          <div className={"pp-editor-priority" + (priority=='ALERT' ? ' selected' : '')}>
                przypis
            </div>


        </div>
          <div className="pp-close">
          <i>X</i>
        </div>
        <div className="editor-input">
          <textarea
            name="comment"
            value={comment}
            onChange={this.handleInputChange}
            placeholder="Dodaj treść przypisu"
          />
        </div>
        {/*TODO move to bottom bar*/}
        {/*<div className="editor-input">*/}
          {/*<input*/}
            {/*type="text"*/}
            {/*name="referenceLink"*/}
            {/*value={referenceLink}*/}
            {/*onChange={this.handleInputChange}*/}
            {/*placeholder="Wklej link do źródła"*/}
          {/*/>*/}
        {/*</div>*/}
        <div className="annotator-controls">
          {/*
                   TODO I guess it'd better to use buttons here, to avoid problems with href value moving the view to top
                    */}
          <a href="#" className="annotator-cancel" onClick={(e) => this.onCancel(e)}>
            {' '}
            Anuluj{' '}
          </a>
          <a href="#" className="annotator-save annotator-focus" onClick={(e) => this.onSave(e)}>
            {' '}
            Zapisz{' '}
          </a>
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
