import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import moment from 'moment';

import ppGa from 'common/pp-ga';
import { selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { hideViewer, showAnnotationForm } from 'common/store/tabs/tab/widgets/actions';

import styles from './Viewer.scss';

import { AnnotationRequestAPIModel } from '../../../common/api/annotation-requests';
import { ID } from '../../../common/api/json-api';

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

    // TODO style
    return (
      <li className={classNames(styles.annotationRequest)}>
        <div className="">
          {createDate ? moment(createDate).fromNow() : ''}
        </div>
        <button onClick={this.handleAnswerButtonClick}>Odpowiedz</button>

        <span> {comment} </span>

      </li>
    );
  }
}
