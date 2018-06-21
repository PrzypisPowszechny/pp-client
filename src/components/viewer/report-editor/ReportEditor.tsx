import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';

import styles from './ReportEditor.scss';
import {
  AnnotationAPIModel,
  AnnotationReportAPIModel,
  AnnotationReportAPICreateModel,
  AnnotationReportResourceType, AnnotationResourceType,
  Reasons,
} from 'api/annotations';
import { hideEditor } from '../../../store/actions';
import Report from './Report';
import { PPScopeClass } from '../../../class_consts';
import Suggestion from './Suggestion';

interface IReportEditorProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
  onSuccess: () => void;
  createAnnotationReport: (instance: AnnotationReportAPICreateModel) => Promise<AnnotationReportAPIModel>;
}

interface IReportEditorState {
  activeDialog: 'menu'|'report'|'suggestion';
}

enum Dialogs {
  MENU = 'menu',
  REPORT = 'report',
  SUGGESTION = 'suggestion',
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
  };

  constructor(props: IReportEditorProps) {
    super(props);
    this.state = ReportEditor.defaultState;
  }

  selectDialog = (e) => {
    this.setState({ activeDialog: e.target.value });
  }

  save = (reason: Reasons, comment: string) => {
    const instance = {
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
    this.props.createAnnotationReport(instance).then(() => {
        this.props.onSuccess();
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  render() {
    const {
      annotation,
      onCancel,
    } = this.props;

    switch (this.state.activeDialog) {
      case 'menu':
        return (
          <div className={classNames(PPScopeClass, styles.self, styles.menu)}>
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
      case 'report':
        return <Report annotation={annotation} onCancel={onCancel} onSubmit={this.save}/>;
      case 'suggestion':
        return <Suggestion annotation={annotation} onCancel={onCancel} onSubmit={this.save}/>;
      default:
        return;
    }
  }
}
