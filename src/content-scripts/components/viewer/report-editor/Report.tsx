import React from 'react';

import classNames from 'classnames';

import { AnnotationReportAPIModel, DataResponse, Reasons } from 'common/api/annotation-reports';
import { AnnotationAPIModel } from 'common/api/annotations';
import ppGa from 'common/pp-ga';
import { PPScopeClass } from 'content-scripts/settings';

import styles from './ReportEditor.scss';

interface IReportProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSubmit: (reason: Reasons, comment: string) => Promise<DataResponse<AnnotationReportAPIModel>|void>;
}

interface IReportState {
  reason: Reasons;
  comment: string;
  showReasonError: boolean;
}

export default class Report extends React.Component<Partial<IReportProps>, Partial<IReportState>> {
  constructor(props: IReportProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    ppGa.annotationReportFormOpened(this.props.annotation.id);
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = {
      [target.name]: target.value,
      showReasonError: target.name !== 'reason' && this.state.showReasonError,
    };
    this.setState(stateUpdate);
  }

  getRadioId(reason: Reasons) {
    return `annotation-${this.props.annotation.id}-report-reason-${reason}`;
  }

  submit = () => {
    if (!this.state.reason) {
      this.setState({ showReasonError: true });
    } else {
      this.props.onSubmit(this.state.reason, this.state.comment).then( () => {
        ppGa.annotationReportSent(this.props.annotation.id, this.state.reason, !this.state.comment);
      }).catch(() => null);
    }
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, styles.selfEdge, styles.editor)}>
        <h3>Co jest nie tak?</h3>
        <div>
          <div className={classNames(styles.radioInputLine)}>
            <input
              id={this.getRadioId(Reasons.BIASED)}
              type="radio"
              name="reason"
              value={Reasons.BIASED}
              onChange={this.handleInputChange}
            />
            <label htmlFor={this.getRadioId(Reasons.BIASED)}> przypis jest nieobiektywny</label>
          </div>
          <div className={classNames(styles.radioInputLine)}>
            <input
              id={this.getRadioId(Reasons.UNRELIABLE)}
              type="radio"
              name="reason"
              value={Reasons.UNRELIABLE}
              onChange={this.handleInputChange}
            />
            <label htmlFor={this.getRadioId(Reasons.UNRELIABLE)}> źródło jest nierzetlne</label>
          </div>
          <div className={classNames(styles.radioInputLine)}>
            <input
              id={this.getRadioId(Reasons.USELESS)}
              type="radio"
              name="reason"
              value={Reasons.USELESS}
              onChange={this.handleInputChange}
            />
            <label htmlFor={this.getRadioId(Reasons.USELESS)}> przypis jest niepotrzebny </label>
          </div>
          <div className={classNames(styles.radioInputLine)}>
            <input
              id={this.getRadioId(Reasons.SPAM)}
              type="radio"
              name="reason"
              value={Reasons.SPAM}
              onChange={this.handleInputChange}
            />
            <label htmlFor={this.getRadioId(Reasons.SPAM)}> spam</label>
          </div>
          <div className={classNames(styles.radioInputLine)}>
            <input
              id={this.getRadioId(Reasons.OTHER)}
              type="radio"
              name="reason"
              value={Reasons.OTHER}
              onChange={this.handleInputChange}
            />
            <label htmlFor={this.getRadioId(Reasons.OTHER)}> inne</label>
          </div>
          <div
            className={classNames(styles['error-msg'], 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hidden]: !this.state.showReasonError })}
          >
            Wybierz typ zgłoszenia!
          </div>
        </div>
        <div>
          <textarea
            name="comment"
            placeholder="Wpisz tutaj swoje uwagi (opcjonalnie)"
            onChange={this.handleInputChange}
          />
        </div>
        <div className={styles.submitButtons}>
          <button onClick={this.props.onCancel} className={styles.cancel}>Anuluj</button>
          <button onClick={this.submit} className={styles.submit}>Wyślij</button>
        </div>
      </div>
    );
  }
}
