import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';

import styles from './ReportEditor.scss';
import {
  AnnotationResourceType, AnnotationAPIModel,
} from 'api/annotations';
import {
  AnnotationReportResourceType, AnnotationReportAPIModel, AnnotationReportAPICreateModel, Reasons,
} from 'api/annotation-reports';
import Report from './Report';
import { PPScopeClass } from '../../../class_consts';
import Suggestion from './Suggestion';
import SuccessToast from './SuccessToast';

interface IReportEditorProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSuccess: () => void;
  createAnnotationReport: (instance: AnnotationReportAPICreateModel) => Promise<AnnotationReportAPIModel>;
}

interface IReportEditorState {
  activeDialog: Dialogs;
  opacity: number;
  isCreating: boolean;
}

enum Dialogs {
  MENU = 'menu',
  REPORT = 'report',
  SUGGESTION = 'suggestion',
  SUCCESS_TOAST = 'success_toast',
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

  static defaultState = {
    activeDialog: Dialogs.MENU,
    opacity: 1,
  };

  constructor(props: IReportEditorProps) {
    super(props);
    this.state = ReportEditor.defaultState;
  }

  selectDialog = (e) => {
    // We use e.currentTarget (the event handling element) since in Chrome e.target returns the node inside button
    this.setState({ activeDialog: e.currentTarget.value });
  }

  getAnnotationInstance(reason: Reasons, comment: string) {
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
      this.props.createAnnotationReport(this.getAnnotationInstance(reason, comment)).then(() => {
        this.setState({ isCreating: false, activeDialog: Dialogs.SUCCESS_TOAST });
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
    } = this.props;

    switch (this.state.activeDialog) {
      case Dialogs.MENU:
        return (
          <div className={classNames(PPScopeClass, styles.self, styles.selfEdge, styles.menu)}>
            <div>
              <button onClick={this.selectDialog} value={Dialogs.REPORT}>
                <span className={classNames(styles.reportIcon)} />
                <span> Zgłoś przypis </span>
              </button>
            </div>
            <div>
              <button onClick={this.selectDialog} value={Dialogs.SUGGESTION}>
                <span className={classNames(styles.suggestIcon)} />
                <span> Zasugeruj poprawkę </span>
              </button>
            </div>
          </div>
        );
      case Dialogs.REPORT:
        return <Report annotation={annotation} onCancel={onCancel} onSubmit={this.save}/>;
      case Dialogs.SUGGESTION:
        return <Suggestion annotation={annotation} onCancel={onCancel} onSubmit={this.save}/>;
      case Dialogs.SUCCESS_TOAST:
          return <SuccessToast onFinish={this.props.onSuccess} />;
      default:
        return null;
    }
  }
}
