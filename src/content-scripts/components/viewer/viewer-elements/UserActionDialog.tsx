import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from '../report-editor/ReportEditor.scss';
import { changeViewerReportEditorOpen } from 'content-scripts/store/widgets/actions';
import { AnnotationAPIModel } from 'common/api/annotations';
import { PPScopeClass } from 'content-scripts/settings';
import ReportEditor from '../report-editor/ReportEditor';
import ppGa from 'common/pp-ga';
import { selectTab } from '../../../../common/store/tabs/selectors';

interface IUserActionDialogProps {
  annotation: AnnotationAPIModel;
  changeViewerReportEditorOpen: (annotationId, isReportEditorOpen) => void;
  onClose: () => void;
}

interface IUserActionDialogState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  activeDialog?: Dialogs;
}

enum Dialogs {
  MENU = 'menu',
  REPORT = 'report',
  SUGGESTION = 'suggestion',
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
    } = selectTab(state).widgets.viewer;
    const viewerItem = selectTab(state).widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      ...viewerItem,
    };
  }, {
    changeViewerReportEditorOpen,
  },
)
export default class UserActionDialog extends React.Component<Partial<IUserActionDialogProps>,
  Partial<IUserActionDialogState>> {

  static defaultState = {
    activeDialog: Dialogs.MENU,
  };

  constructor(props: IUserActionDialogProps) {
    super(props);
    this.state = UserActionDialog.defaultState;
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
    this.props.changeViewerReportEditorOpen(this.props.annotation.id, false);
    this.props.onClose();
  }

  render() {
    switch (this.state.activeDialog) {
      case Dialogs.MENU:
        return (
          <div className={classNames(PPScopeClass, styles.self, styles.selfEdge, styles.menu)}>
            <div>
              <button onClick={this.openReportEditor} value={Dialogs.REPORT}>
                <span className={classNames(styles.reportIcon)}/>
                <span> Zgłoś przypis </span>
              </button>
            </div>
            <div>
              <button onClick={this.openReportEditor} value={Dialogs.SUGGESTION}>
                <span className={classNames(styles.suggestIcon)}/>
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
  }
}
