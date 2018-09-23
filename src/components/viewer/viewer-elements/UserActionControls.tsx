import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from '../Viewer.scss';
import {hideViewer} from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';

import Upvote from './Upvote';
import UserActionDialog from './UserActionDialog';
import ppGA from '../../../pp-ga';

interface IUserActionControlsProps {
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
    } = state.widgets.viewer;
    const viewerItem = state.widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

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
      <div>
        <Upvote annotation={this.props.annotation}/>
        <div className={classNames(styles.controls, styles.visible)}>
          <button
            type="button"
            title="Edit"
            onClick={this.toggleDialog}
          >
            <span className={classNames(styles.actionsIcon)}/>
          </button>
        </div>
        {this.state.isDialogOpen &&
          <UserActionDialog annotation={this.props.annotation} onClose={this.toggleDialog} />
        }
      </div>
    );
  }
}
