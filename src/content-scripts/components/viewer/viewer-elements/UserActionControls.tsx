import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from '../Viewer.scss';
import { hideViewer } from 'content-scripts/store/widgets/actions';
import { AnnotationAPIModel } from 'common/api/annotations';
import Upvote from './Upvote';
import UserActionDialog from './UserActionDialog';
import ppGa from 'common/pp-ga';
import { Icon } from 'react-icons-kit';
import { ic_more_horiz } from 'react-icons-kit/md/ic_more_horiz';
import { selectTab } from '../../../../common/store/tabs/selectors';

interface IUserActionControlsProps {
  indirectChildClassName: string;
  locationX: number;
  locationY: number;
  annotation: AnnotationAPIModel;

  hideViewer: () => void;
}

interface IUserActionControlsState {
  isDialogOpen: boolean;
}

@connect(
  (state, props) => {
    const {
      location: {
          x: locationX,
          y: locationY,
      },
    } = selectTab(state).widgets.viewer;
    const viewerItem = selectTab(state).widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

    return {
      locationX,
      locationY,
      ...viewerItem,
    };
  }, {
    hideViewer,
  },
)
export default class UserActionControls extends
  React.Component<
    Partial<IUserActionControlsProps>,
    Partial<IUserActionControlsState>
  > {

  static defaultState = {
    isDialogOpen: false,
  };

  constructor(props: IUserActionControlsProps) {
    super(props);
    this.state = UserActionControls.defaultState;
  }

  toggleDialog = () => {
    this.setState({ isDialogOpen: !this.state.isDialogOpen });
  }

  render() {
    return (
      <div className={styles.controlsContainer}>
        <div className={classNames(styles.controls, styles.visible)}>
          <Upvote annotation={this.props.annotation}  indirectChildClassName={this.props.indirectChildClassName}/>
          <button
            className={styles.ppButton}
            type="button"
            title="Więcej"
            onClick={this.toggleDialog}
          >
            <Icon icon={ic_more_horiz} size={20}/>
          </button>
        </div>
        {this.state.isDialogOpen &&
          <UserActionDialog annotation={this.props.annotation} onClose={this.toggleDialog} />
        }
      </div>
    );
  }
}
