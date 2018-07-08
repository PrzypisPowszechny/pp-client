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
import Timer = NodeJS.Timer;

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
  DONE_TOAST = 'done_toast',
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

  fadeOutTimer: Timer = null;

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
        this.setState({ isCreating: false, activeDialog: Dialogs.DONE_TOAST });
        this.fadeOutTimer = setTimeout(this.fadeOutStart, 1000);
      })
      .catch((errors) => {
        this.setState({ isCreating: false });
        console.log(errors);
        // TODO: show error toast here
      });
    }
  }

  fadeOutStart = () => {
    this.fadeOutTimer = setInterval(this.fadeOutTick, 100);
  }

  fadeOutTick = () => {
    if (this.state.opacity > 0) {
      this.setState({ opacity: this.state.opacity - 0.03 });
    } else {
      clearInterval(this.fadeOutTimer);
      this.props.onSuccess();
    }
  }

  componentWillUnmount() {
    clearInterval(this.fadeOutTimer);
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
      case Dialogs.DONE_TOAST:
          return (
            <div
              className={classNames(styles.self, styles.selfOffset, styles.toast)}
              style={{ opacity: this.state.opacity }}
            >
              <div className={classNames(PPScopeClass, styles.selfEdge, styles.toast)}>
                Twoje zgłoszenie zostało wysłane. Dziękujemy, że pomagasz nam ulepszać przypisy
              </div>
            </div>

          );
      default:
        return null;
    }
  }
}
