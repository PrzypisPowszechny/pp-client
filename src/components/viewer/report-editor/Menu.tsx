import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';

// import ViewerItem from './ViewerItem';
import styles from './Menu.scss';
import { selectViewerState } from 'store/widgets/selectors';
// import { hideViewer, openViewerDeleteModal, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { AnnotationAPICreateModel } from '../../../api/annotations';
import { hideEditor } from '../../../store/actions';
// import { IEditorProps } from '../interfaces';
import { AnnotationPriorities } from '../../consts';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
// import { mouseOverViewer } from 'store/widgets/actions';
// import DeleteAnnotationModal from './DeleteAnnotationModal';

interface IMenuProps {
  annotation: AnnotationAPIModel;
}

@connect(
  state => state,
  dispatch => ({}),
)
export default class Menu extends React.Component<Partial<IMenuProps>, {}> {

  constructor(props: IMenuProps) {
    super(props);
  }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self)}>
        menu
      </div>
    );
  }
}
