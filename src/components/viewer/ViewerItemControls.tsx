import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';

import styles from './Viewer.scss';
import {
  changeViewerReportEditorOpen,
  hideViewer,
  showEditorAnnotation,
} from 'store/widgets/actions';
import {
  AnnotationResourceType, AnnotationAPIModel,
  AnnotationPriorities, annotationPrioritiesLabels,
} from 'api/annotations';
import {
  AnnotationUpvoteResourceType, AnnotationUpvoteAPIModel, AnnotationUpvoteAPICreateModel,
} from 'api/annotation-upvotes';
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
  React.Component<Partial<IViewerItemControlsProps>,
  Partial<IViewerItemControlsState>>
{

  static editControlDisappearTimeout = 500;

  static defaultState = {
    initialView: true,
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

  toggleReportEditor = (e?: any) => {
    const {
      annotation,
      isReportEditorOpen,
    } = this.props;
    this.props.changeViewerReportEditorOpen(annotation.id, !isReportEditorOpen);
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
              onClick={this.toggleReportEditor}
            >
              <span className={classNames(styles.actionsIcon)}/>
            </button>
          </div>
         {!this.props.isReportEditorOpen ? null :
            <ReportEditor
                annotation={this.props.annotation}
                onCancel={this.toggleReportEditor}
                onSuccess={this.toggleReportEditor}
            />
          }
        </div>
      );
    }
  }
}
