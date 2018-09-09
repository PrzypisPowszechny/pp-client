import React from 'react';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';

import {
  AnnotationResourceType, AnnotationAPIModel, AnnotationViewModel,
} from 'api/annotations';
import {
  AnnotationReportResourceType, AnnotationReportAPIModel, AnnotationReportAPICreateModel, Reasons,
} from 'api/annotation-reports';
import Report from './Report';
import Suggestion from './Suggestion';
import SuccessToast from './SuccessToast';

interface IReportEditorProps {
  reportComponentClass: typeof Report | typeof Suggestion;
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSuccess: () => void;
  createAnnotationReport: (instance: AnnotationReportAPICreateModel) => Promise<AnnotationReportAPIModel>;
}

interface IReportEditorState {
  opacity: number;
  isCreating: boolean;
  isDisplayingToast: boolean;
}

@connect(
  state => state,
  dispatch => ({
    createAnnotationReport: (instance: AnnotationReportAPICreateModel) => {
        return dispatch(createResource(instance));
    },
  }),
)
export default class ReportEditor extends React.Component<Partial<IReportEditorProps>, Partial<IReportEditorState>> {

  static Report = Report;
  static Suggestion = Suggestion;

  static defaultState = {
    opacity: 1,
  };

  constructor(props: IReportEditorProps) {
    super(props);
    this.state = ReportEditor.defaultState;
  }

  getAnnotationReportInstance(reason: Reasons, comment: string) {
    return {
      type: AnnotationReportResourceType,
      attributes: { reason, comment },
      relationships: {
        annotation: {
          data: {
            id: this.props.annotation.id,
            type: AnnotationResourceType,
          },
        },
      },
    };
  }

  save = (reason: Reasons, comment: string) => {
    if (!this.state.isCreating) {
      this.setState({ isCreating: true });
      this.props.createAnnotationReport(this.getAnnotationReportInstance(reason, comment)).then(() => {
        this.setState({ isCreating: false, isDisplayingToast: true });
      })
      .catch((errors) => {
        this.setState({ isCreating: false });
        console.log(errors);
        // TODO: show error toast here
      });
    }
  }

  render() {
    const {
      annotation,
      onCancel,
      reportComponentClass: ReportComponentClass,
    } = this.props;

    if (!this.state.isDisplayingToast) {
      return <ReportComponentClass annotation={annotation} onCancel={onCancel} onSubmit={this.save} />;
    } else {
      return <SuccessToast onFinish={this.props.onSuccess} />;
    }
  }
}
