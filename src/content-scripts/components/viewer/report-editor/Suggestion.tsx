import React from 'react';
import classNames from 'classnames';
import styles from './ReportEditor.scss';
import { AnnotationAPIModel } from 'content-scripts/api/annotations';
import { Reasons } from 'content-scripts/api/annotation-reports';
import { PPScopeClass } from 'content-scripts/class_consts';
import ppGA from 'common/pp-ga';
import { AnnotationReportAPIModel, DataResponse } from '../../../api/annotation-reports';

interface ISuggestionProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSubmit: (reason: Reasons, comment: string) => Promise<DataResponse<AnnotationReportAPIModel>|void>;
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

  componentDidMount() {
    ppGA.annotationSuggestionFormOpened(this.props.annotation.id);
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
    } else {
      this.props.onSubmit(Reasons.SUGGESTED_CORRECTION, this.state.comment).then( () => {
        ppGA.annotationSuggestionSent(this.props.annotation.id, !this.state.comment);
      }).catch(() => null);
    }
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, styles.selfEdge, styles.editor)}>
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
            className={classNames(styles['error-msg'], 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hidden]: !this.state.showCommentError })}
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
