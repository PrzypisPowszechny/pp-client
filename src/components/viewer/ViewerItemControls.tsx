import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import styles from './Viewer.scss';
// TODO: refactor ReportEditor.scss styles
import menuStyles from './report-editor/ReportEditor.scss';
import {
  changeViewerReportEditorOpen,
  showEditorAnnotation,
} from 'store/widgets/actions';
import {AnnotationAPIModel,
} from 'api/annotations';
import Timer = NodeJS.Timer;
import { PPScopeClass } from '../../class_consts';
import { extractHostname, httpPrefixed } from '../../utils/url';
import ReportEditor from './report-editor/ReportEditor';

interface IViewerItemControlsProps {
  annotation: AnnotationAPIModel;
  isReportEditorOpen: boolean;

  changeViewerReportEditorOpen: (annotationId, isReportEditorOpen) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface IViewerItemControlsState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  activeDialog?: Dialogs;
}

enum Dialogs {
  MENU = 'menu',
  REPORT = 'report',
  SUGGESTION = 'suggestion',
  SUCCESS_TOAST = 'success_toast',
}

@connect(
  (state, props) => {
    const viewerItem = state.widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

    return {
      ...viewerItem,
    };
  },
  dispatch => ({
    changeViewerReportEditorOpen: (annotationId, isReportEditorOpen) =>
      dispatch(changeViewerReportEditorOpen(annotationId, isReportEditorOpen)),
    showEditorAnnotation: () => dispatch(showEditorAnnotation),
  }),
)
export default class ViewerItemControls extends
  React.Component<
    Partial<IViewerItemControlsProps>,
    Partial<IViewerItemControlsState>
  > {
  static editControlDisappearTimeout = 500;

  static defaultState = {
    initialView: true,
    activeDialog: null,
  };

  disappearTimeoutId: Timer;

  constructor(props: IViewerItemControlsProps) {
    super(props);
    this.state = ViewerItemControls.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutId = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutId = null;
      },
      ViewerItemControls.editControlDisappearTimeout,
    );
  }

  componentWillUnmount() {
    if (this.disappearTimeoutId) {
      clearTimeout(this.disappearTimeoutId);
    }
  }

  onEditClick = (e) => {
    this.props.onEdit(this.props.annotation.id);
  }

  onDeleteClick = (e) => {
    this.props.onDelete(this.props.annotation.id);
  }

  selectDialog = (e: any) => {
      // We use e.currentTarget (the event handling element) since in Chrome e.target returns the node inside button
      this.setState({ activeDialog: e.currentTarget.value });
  }

  openReportEditor = (e) => {
    this.selectDialog(e);
    this.props.changeViewerReportEditorOpen(this.props.annotation.id, true);
  }

  closeReportEditor = () => {
    this.setState({ activeDialog: null });
    this.props.changeViewerReportEditorOpen(this.props.annotation.id, false);
  }

  render() {
    if (this.props.annotation.attributes.doesBelongToUser) {
      return (
        <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
          <button
            type="button"
            title="Edit"
            onClick={this.onEditClick}
          >
            <i className="edit icon"/>
          </button>
          <button
            type="button"
            title="Delete"
            onClick={this.onDeleteClick}
          >
            <i className="trash icon"/>
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div className={classNames(styles.controls, styles.visible)}>
            <button
              type="button"
              title="Edit"
              onClick={this.selectDialog}
              value={Dialogs.MENU}
            >
              <span className={classNames(styles.actionsIcon)}/>
            </button>
          </div>
         {
           (() => {
             switch (this.state.activeDialog) {
               case Dialogs.MENU:
                 return (
                   <div className={classNames(PPScopeClass, menuStyles.self, menuStyles.selfEdge, menuStyles.menu)}>
                    <div>
                      <button onClick={this.openReportEditor} value={Dialogs.REPORT}>
                        <span className={classNames(menuStyles.reportIcon)} />
                        <span> Zgłoś przypis </span>
                      </button>
                    </div>
                    <div>
                      <button onClick={this.openReportEditor} value={Dialogs.SUGGESTION}>
                        <span className={classNames(menuStyles.suggestIcon)} />
                        <span> Zasugeruj poprawkę </span>
                      </button>
                    </div>
                  </div>
                 );
               case Dialogs.REPORT:
                 return (
                   <ReportEditor
                     reportComponentClass={ReportEditor.Report}
                     annotation={this.props.annotation}
                     onCancel={this.closeReportEditor}
                     onSuccess={this.closeReportEditor}
                   />
                 );
               case Dialogs.SUGGESTION:
                 return (
                   <ReportEditor
                     reportComponentClass={ReportEditor.Suggestion}
                     annotation={this.props.annotation}
                     onCancel={this.closeReportEditor}
                     onSuccess={this.closeReportEditor}
                   />
                 );
               default:
                return <div/>;
             }
           })()
         }
        </div>
      );
    }
  }
}
