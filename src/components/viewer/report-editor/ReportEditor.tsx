import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';

// import ViewerItem from './ViewerItem';
import styles from './ReportEditor.scss';
import { selectViewerState } from 'store/widgets/selectors';
// import { hideViewer, openViewerDeleteModal, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { AnnotationAPICreateModel } from '../../../api/annotations';
import { hideEditor } from '../../../store/actions';
import { AnnotationPriorities } from '../../consts';
import Report from './Report';
import { PPScopeClass } from '../../../class_consts';
import Suggestion from './Suggestion';
// import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
// import { mouseOverViewer } from 'store/widgets/actions';
// import DeleteAnnotationModal from './DeleteAnnotationModal';

interface IReportEditorProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
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
    reportAnnotation: (instance: AnnotationAPICreateModel) => {
      // if (instance.id) {
      //   return dispatch(updateResource(instance));
      // } else {
      //   return dispatch(createResource(instance));
      // }
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
    this.setState({activeDialog: e.target.rel});
  }

  render() {
    const {
      annotation,
      onCancel,
    } = this.props;

    switch (this.state.activeDialog) {
      case 'menu':
        return (
          <div className={classNames(PPScopeClass, styles.self)}>
            <a onClick={this.selectDialog} rel={Dialogs.REPORT}> raportuj </a>
            <a onClick={this.selectDialog} rel={Dialogs.SUGGESTION}> sugeruj </a>
          </div>
        );
      case 'report':
        return <Report annotation={annotation} onCancel={onCancel}/>;
      case 'suggestion':
        return <Suggestion annotation={annotation} onCancel={onCancel}/>;
      default:
        return;
    }
  }
}
