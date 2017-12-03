import React from 'react';
import { AnnotationPriorities } from '../consts';
import {IAnnotationFields, AnnotationViewModel} from '../annotation';

const savedFields = ['priority', 'comment', 'referenceLink', 'referenceLinkTitle'];
import '../../css/viewer.scss';


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
    return (
      <div className="pp-widget">
        <ul className="pp-listing">
          <li className="annotator-item">
            <textarea
              name="comment"
              value={this.state.comment}
              onChange={this.handleInputChange}
              placeholder="Komentarz"
            />
          </li>
          <li className="annotator-item">
            <input
              type="text"
              name="referenceLink"
              value={this.state.referenceLink}
              onChange={this.handleInputChange}
              placeholder="Link źródła"
            />
          </li>
          <li className="annotator-item">
            <input
              type="text"
              name="referenceLinkTitle"
              value={this.state.referenceLinkTitle}
              onChange={this.handleInputChange}
              placeholder="Tytuł źródła"
            />
          </li>
        </ul>
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
