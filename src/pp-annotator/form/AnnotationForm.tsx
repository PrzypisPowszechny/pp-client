import * as React from 'react';
import { annotationPriorities } from '../consts';
import IAnnotation, { IAnnotationFields } from '../i-annotation';

const savedFields = ['annotationPriority', 'comment', 'link', 'linkTitle', 'isLinkOnly'];

export interface IAnnotationFormProps {
  id: number;
  annotation: IAnnotation;
  saveAction(annotation: IAnnotation): any;
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
  IAnnotationFormState
> {

  private static stateFromProps(props: IAnnotationFormProps): IAnnotationFormState {
    const fields = props.annotation.fields || {};
    return {
      annotationPriority: fields.annotationPriority || annotationPriorities.NORMAL,
      comment: fields.comment || '',
      link: fields.link || '',
      linkTitle: fields.linkTitle || '',
      isLinkOnly: fields.isLinkOnly || false
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
          <a href="#" className="annotator-cancel" onClick={(e) => this.onCancel(e)}>
            {' '}
            Anuluj{' '}
          </a>
          <a href="#" className="annotator-save annotator-focus" onClick={(e) => this.onSave(e)}>
            {' '}
            Zapisz{' '}
          </a>
        </div>
      </form>
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

  private handleIsLinkOnlyChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ isLinkOnly: e.currentTarget.checked });
  }

  private onSave(event: any) {
    const fieldsToSave = getFormState(this.state);
    if (this.state.isLinkOnly) {
      fieldsToSave.comment = '';
    }
    this.props.annotation.fields = fieldsToSave;
    const result = this.props.saveAction(this.props.annotation);
    const errors = result.errors;
    if (!errors) {
      //TODO handle form validation messages here
    }
    else {
      this.props.onSave(event);
    }
  }

  private onCancel(event: any) {
    this.props.onCancel(event);
  }
}
