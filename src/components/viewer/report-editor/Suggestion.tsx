import React from 'react';
import classNames from 'classnames';
import styles from './ReportEditor.scss';
import { AnnotationAPIModel, Reasons } from 'api/annotations';
import { PPScopeClass } from '../../../class_consts';

interface ISuggestionProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSubmit: (reason: Reasons, comment: string) => void;
}

interface ISuggestionState {
  comment: string;
}

export default class Suggestion extends React.Component<Partial<ISuggestionProps>, Partial<ISuggestionState>> {
  constructor(props: ISuggestionProps) {
    super(props);
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = { [target.name]: target.value };
    this.setState(stateUpdate);
  }

  submit = () => {
    // TODO: validate and only if ok, call onSubmit
    this.props.onSubmit(Reasons.SPAM, this.state.comment);
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, styles.editor)}>
        <div>
          <textarea name="comment" onChange={this.handleInputChange} />
        </div>
        <button onClick={this.submit}>Wyślij</button>
        <button onClick={this.props.onCancel}>Anuluj</button>
      </div>
    );
  }
}
