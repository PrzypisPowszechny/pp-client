import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import moment from 'moment';
import { Icon } from 'react-icons-kit/Icon';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';

import ppGa from 'common/pp-ga';
import { selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { hideViewer, showAnnotationForm } from 'common/store/tabs/tab/widgets/actions';

import styles from './ViewerItem.scss';

import { AnnotationRequestAPIModel } from '../../../common/api/annotation-requests';
import { ID } from '../../../common/api/json-api';
import Button from '../elements/Button/Button';

interface IViewerAnnotationRequestItemProps {
  key: string;
  annotationRequestId: string;

  annotationRequest: AnnotationRequestAPIModel;

  hideViewer: () => any;
  showAnnotationForm: (id: ID) => any;
}

@connect(
  (state, props) => ({
    annotationRequest: selectAnnotationRequest(state, props.annotationRequestId),
  }), {
    hideViewer,
    showAnnotationForm,
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
    // TODO ppGa
    // ppGa.annotationDisplayed(this.props.annotationId, ppCategory, !comment, annotationLink);
  }

  handleAnswerButtonClick = () => {
    this.props.hideViewer();
    this.props.showAnnotationForm(this.props.annotationRequestId);
    // todo ppGa
    // ppGa.annotationLinkClicked(this.props.annotationId, ppCategory, !comment, annotationLink);
  }

  render() {
    const {
      comment,
      createDate,
    } = this.props.annotationRequest.attributes;

    return (
      <li className={classNames(styles.self, styles.annotationRequest)}>
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
