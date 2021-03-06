import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_star } from 'react-icons-kit/md/ic_star';
import { connect } from 'react-redux';

import classNames from 'classnames';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';

import {
  AnnotationUpvoteAPICreateModel,
  AnnotationUpvoteAPIModel,
  AnnotationUpvoteResourceType,
} from 'common/api/annotation-upvotes';
import { AnnotationAPIModel, AnnotationResourceType } from 'common/api/annotations';
import ppGa from 'common/pp-ga';
import { createResource, deleteResource, readEndpoint } from 'common/store/tabs/tab/api/actions';
import { selectUpvote } from 'common/store/tabs/tab/api/selectors';
import { PPScopeClass } from 'content-scripts/settings';

import { PPViewerIndirectHoverClass } from '../../../settings';
import styles from '../ViewerItem.scss';

interface IUpvoteProps {
  annotation: AnnotationAPIModel;
  upvoteId?: string;
  upvoteUrl: string;
  upvote?: AnnotationUpvoteAPIModel;

  fetchUpvote: (url: string) => Promise<object>;
  deleteUpvote: (instance: AnnotationUpvoteAPIModel) => Promise<object>;
  createUpvote: (instance: AnnotationUpvoteAPICreateModel) => Promise<object>;
}

interface IUpvoteState {
  isFetchingUpvote: boolean;
}

@connect(
  (state, props) => {
    const {
      data: upvoteData,
      links: { related: upvoteUrl },
    } = props.annotation.relationships.annotationUpvote;
    const upvoteId = upvoteData ? upvoteData.id : null;

    return {
      upvoteId,
      upvoteUrl,
      upvote: upvoteId ? selectUpvote(state, upvoteId) : null,
    };
  },
  dispatch => ({
    fetchUpvote: (url: string) => dispatch(readEndpoint(url)),
    deleteUpvote: (instance: AnnotationUpvoteAPIModel) => dispatch(deleteResource(instance)),
    createUpvote: (instance: AnnotationUpvoteAPICreateModel) => dispatch(createResource(instance)),
  }),
)
export default class Upvote extends React.Component<Partial<IUpvoteProps>, Partial<IUpvoteState>> {

  constructor(props: IUpvoteProps) {
    super(props);

    if (props.upvoteId && !props.upvote) {
      props.fetchUpvote(props.upvoteUrl)
        .then(() => this.setState({ isFetchingUpvote: false }))
        .catch(errors => console.log(errors));
      this.state =  { isFetchingUpvote: true };
    } else {
      this.state = {};
    }
  }

  toggleUpvote = (e) => {
    const { annotation, upvote } = this.props;
    const { attributes: attrs } =  annotation;
    if (upvote) {
      this.props.deleteUpvote(upvote).then(() => {
        ppGa.annotationUpvoteCancelled(annotation.id, attrs.ppCategory, !attrs.comment, attrs.annotationLink);
      }).catch((errors) => {
        console.log(errors);
      });
    } else {
      this.props.createUpvote({
        type: AnnotationUpvoteResourceType,
        relationships: {
          annotation: {
            data: {
              id: annotation.id,
              type: AnnotationResourceType,
            },
          },
        },
      }).then(() => {
        ppGa.annotationUpvoted(annotation.id, attrs.ppCategory, !attrs.comment, attrs.annotationLink);
      }).catch((errors) => {
        console.log(errors);
      });
    }
  }

  renderUpvoteButton() {
    const { annotation } = this.props;
    const { annotationUpvote } = annotation.relationships;
    const totalUpvoteCount = annotation.attributes.upvoteCountExceptUser + (annotationUpvote.data ? 1 : 0);
    return (
      <button
        className={classNames('ui', styles.ppButton, styles.upvote, {
          [styles.selected]: Boolean(annotationUpvote.data),
        })
        }
        onClick={this.toggleUpvote}
      >
        <Icon icon={ic_star} size={20} />
        <span className={styles.number}>{totalUpvoteCount}</span>
      </button>
    );
  }

  render() {
    return this.state.isFetchingUpvote ? null : (
        <Popup
          trigger={this.renderUpvoteButton()}
          size="small"
          className={classNames(PPViewerIndirectHoverClass, PPScopeClass, styles.popup, 'pp-popup-small-padding')}
          inverted={true}
        >
          Daj znać, że uważasz przypis za pomocny.
        </Popup>
    );
  }

}
