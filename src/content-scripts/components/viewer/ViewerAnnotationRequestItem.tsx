import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { connect } from 'react-redux';

import classNames from 'classnames';
import moment from 'moment';

import ppGa from 'common/pp-ga';
import { selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { hideViewer, showAnnotationAddForm } from 'common/store/tabs/tab/widgets/actions';

import styles from './ViewerItem.scss';

import { E2E_ANNOTATION_REQUEST_CLASS } from '../../../../e2e/shared/classes';
import { AnnotationRequestAPIModel } from '../../../common/api/annotation-requests';
import { ID } from '../../../common/api/json-api';
import Button from '../elements/Button/Button';

interface IViewerAnnotationRequestItemProps {
  key: string;
  annotationRequestId: string;

  annotationRequest: AnnotationRequestAPIModel;

  hideViewer: () => any;
  showAnnotationAddForm: (id: ID) => any;
}

@connect(
  (state, props) => ({
    annotationRequest: selectAnnotationRequest(state, props.annotationRequestId),
  }), {
    hideViewer,
    showAnnotationAddForm,
  },
)
export default class ViewerAnnotationRequestItem extends React.Component<Partial<IViewerAnnotationRequestItemProps>,
  {}> {

  static defaultState = {};

  constructor(props: IViewerAnnotationRequestItemProps) {
    super(props);
    this.state = ViewerAnnotationRequestItem.defaultState;
  }

  componentDidMount() {
    const {
      annotationRequestId,
      annotationRequest: { attributes: { comment } },
    } = this.props;
    ppGa.annotationRequestDisplayed(annotationRequestId, !comment);
  }

  handleAnswerButtonClick = () => {
    const {
      annotationRequestId,
      annotationRequest: { attributes: { comment } },
    } = this.props;
    this.props.hideViewer();
    this.props.showAnnotationAddForm(annotationRequestId);
    ppGa.annotationRequestAnswerButtonClicked(annotationRequestId, !comment);
  }

  render() {
    const {
      comment,
      createDate,
    } = this.props.annotationRequest.attributes;

    return (
      <li className={classNames(styles.self, styles.annotationRequest, E2E_ANNOTATION_REQUEST_CLASS)}>
        <div className={styles.headBar}>
          <div className={classNames(styles.header, styles.categoryAnnotationRequest)}>
            <Icon className={styles.headerIcon} icon={ic_live_help} size={15}/>
            Poproszono o przypis
          </div>
          <div className={styles.commentDate}>
            {createDate ? moment(createDate).fromNow() : ''}
          </div>
        </div>
        <div className={styles.content}>

          <div className={styles.comment}> {comment} </div>
          <div>
            <Button appearance="primary" onClick={this.handleAnswerButtonClick}>Odpowiedz</Button>
          </div>
        </div>

      </li>
    );
  }
}
