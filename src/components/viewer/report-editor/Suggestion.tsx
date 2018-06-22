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
  showCommentError: boolean;
}

export default class Suggestion extends React.Component<Partial<ISuggestionProps>, Partial<ISuggestionState>> {
  constructor(props: ISuggestionProps) {
    super(props);
    this.state = {};
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = {
      [target.name]: target.value,
      showCommentError: target.name !== 'reason' && this.state.showCommentError,
    };
    this.setState(stateUpdate);
  }

  submit = () => {
    if (!this.state.comment) {
      this.setState({ showCommentError: true });
    }
    this.props.onSubmit(Reasons.SUGGESTED_CORRECTION, this.state.comment);
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, styles.editor)}>
        <h3>Co można poprawić w tym przypisie?</h3>
        <div className={classNames(styles.input)}>
          <div>
            <textarea
              name="comment"
              placeholder="Wpisz tutaj swoje uwagi"
              onChange={this.handleInputChange}
            />
          </div>
          <div
            className={classNames('error-msg', 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: !this.state.showCommentError })}
          >
            Wpisz swoje uwagi!
          </div>
        </div>
        <div className={styles.submitButtons}>
          <button onClick={this.props.onCancel} className={styles.cancel}>Anuluj</button>
          <button onClick={this.submit} className={styles.submit}>Wyślij</button>
        </div>
      </div>
    );
  }
}
