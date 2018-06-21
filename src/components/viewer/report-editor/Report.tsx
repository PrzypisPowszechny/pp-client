import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';

import styles from './ReportEditor.scss';
import { selectViewerState } from 'store/widgets/selectors';
import {
  AnnotationAPIModel,
  AnnotationReportAPIModel,
  AnnotationReportAPICreateModel,
  AnnotationReportResourceType, AnnotationResourceType,
  Reasons,
} from 'api/annotations';
import { AnnotationAPICreateModel } from '../../../api/annotations';
import { PPScopeClass } from '../../../class_consts';
// import { hideEditor } from '../../../store/actions';
// import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
// import { mouseOverViewer } from 'store/widgets/actions';

interface IReportProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  createAnnotationReport: (instance: AnnotationReportAPICreateModel) => Promise<AnnotationReportAPIModel>;
}

interface IReportState {
  reason: Reasons;
  comment: string;
}

@connect(
  state => state,
  dispatch => ({
    createAnnotationReport: (instance: AnnotationReportAPICreateModel) => {
        return dispatch(createResource(instance));
    },
  }),
)
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

  save = () => {
    const instance = {
      type: AnnotationReportResourceType,
      attributes: {
        reason: this.state.reason,
        comment: this.state.comment,
      },
      relationships: {
        annotation: {
          data: {
            id: this.props.annotation.id,
            type: AnnotationResourceType,
          },
        },
      },
    };
    this.props.createAnnotationReport(instance).then(() => {
        console.log('happy');
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  render() {
    const {
      annotation,
    } = this.props;
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
        <button onClick={this.save}>Wyślij</button>
        <button onClick={this.props.onCancel}>Anuluj</button>
      </div>
    );
  }
}
