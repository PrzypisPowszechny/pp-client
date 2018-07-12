import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './Viewer.scss';
// TODO: refactor ReportEditor.scss styles
import menuStyles from './report-editor/ReportEditor.scss';
import {
  hideViewer,
  openViewerDeleteModal,
  changeViewerReportEditorOpen,
  showEditorAnnotation,
} from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import Timer = NodeJS.Timer;
import { PPScopeClass } from '../../class_consts';
import ReportEditor from './report-editor/ReportEditor';

interface IViewerItemControlsProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  annotation: AnnotationAPIModel;

  changeViewerReportEditorOpen: (annotationId, isReportEditorOpen) => void;
  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  openViewerDeleteModal: (id: string) => void;
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
    const {
      location: {
          x: locationX,
          y: locationY,
      },
      deleteModal: {
        isDeleteModalOpen,
      },
    } = state.widgets.viewer;
    const viewerItem = state.widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      ...viewerItem,
    };
  }, {
    changeViewerReportEditorOpen,
    showEditorAnnotation,
    hideViewer,
    openViewerDeleteModal,
  },
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

  disappearTimeoutTimer: Timer;

  constructor(props: IViewerItemControlsProps) {
    super(props);
    this.state = ViewerItemControls.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutTimer = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutTimer = null;
      },
      ViewerItemControls.editControlDisappearTimeout,
    );
  }

  componentWillUnmount() {
    if (this.disappearTimeoutTimer) {
      clearTimeout(this.disappearTimeoutTimer);
    }
  }

  onAnnotationEditClick = () => {
    const {
      locationX,
      locationY,
      annotation,
    } = this.props;
    this.props.showEditorAnnotation(locationX, locationY, annotation.id);
    this.props.hideViewer();
  }

  onAnnotationDeleteClick = () => {
    this.props.openViewerDeleteModal(this.props.annotation.id);
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
            onClick={this.onAnnotationEditClick}
          >
            <i className="edit icon"/>
          </button>
          <button
            type="button"
            title="Delete"
            onClick={this.onAnnotationDeleteClick}
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
