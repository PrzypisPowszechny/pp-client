import React from 'react';
import classNames from 'classnames';

import styles from './ReportEditor.scss';
import { AnnotationAPIModel, Reasons } from 'api/annotations';
import { PPScopeClass } from '../../../class_consts';

interface IReportProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSubmit: (reason: Reasons, comment: string) => void;
}

interface IReportState {
  reason: Reasons;
  comment: string;
}

export default class Report extends React.Component<Partial<IReportProps>, Partial<IReportState>> {
  constructor(props: IReportProps) {
    super(props);
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = { [target.name]: target.value };
    this.setState(stateUpdate);
  }

  getRadioId(reason: Reasons) {
    return `annotation-${this.props.annotation.id}-report-reason-${Reasons.OTHER}`;
  }

  submit = () => {
    // TODO: validate and only if ok, call onSubmit
    this.props.onSubmit(this.state.reason, this.state.comment);
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, styles.editor)}>
        <div>

          <input
            id={this.getRadioId(Reasons.SPAM)}
            type="radio"
            name="reason"
            value={Reasons.SPAM}
            onChange={this.handleInputChange}
          />
          <label htmlFor={this.getRadioId(Reasons.SPAM)}> Spam</label>

          <input
            id={this.getRadioId(Reasons.OTHER)}
            type="radio"
            name="reason"
            value={Reasons.OTHER}
            onChange={this.handleInputChange}
          />
          <label htmlFor={this.getRadioId(Reasons.OTHER)}> Inny</label>

          <textarea name="comment" onChange={this.handleInputChange} />

        </div>
        <button onClick={this.submit}>Wyślij</button>
        <button onClick={this.props.onCancel}>Anuluj</button>
      </div>
    );
  }
}
