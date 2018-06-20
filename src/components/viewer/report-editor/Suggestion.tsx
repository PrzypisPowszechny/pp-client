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
import { PPScopeClass } from '../../../class_consts';
// import { hideEditor } from '../../../store/actions';
// import { IEditorProps } from '../interfaces';
// import { AnnotationPriorities } from '../../consts';
// import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
// import { mouseOverViewer } from 'store/widgets/actions';
// import DeleteAnnotationModal from './DeleteAnnotationModal';

interface ISuggestionProps {
  annotation: AnnotationAPIModel;
  onCancel: (e) => void;
}

interface ISuggestionState {
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
export default class Suggestion extends React.Component<Partial<ISuggestionProps>, Partial<ISuggestionState>> {
  constructor(props: ISuggestionProps) {
    super(props);
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self)}>
        suggestion
        <a onClick={this.props.onCancel}>Anuluj</a>
      </div>
    );
  }
}
