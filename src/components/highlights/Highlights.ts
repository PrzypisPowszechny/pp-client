import React from 'react';
import { connect } from 'react-redux';
import {Highlighter} from 'core';
import {showViewer} from 'store/widgets/actions';
import { mousePosition } from 'common/dom';

interface IHighlightsProps {
  annotations: any[];
  showViewer: (x: number, y: number, annotationId: number) => void;
}

@connect(
  state => ({
    annotations: state.annotations.data,
  }),
  dispatch => ({
    showViewer: (x, y, annotationId) => dispatch(showViewer(x, y, annotationId)),
  }),
)
export default class Highlights extends React.Component<Partial<IHighlightsProps>, {}> {
  highlighter: Highlighter;

  constructor(props: IHighlightsProps) {
    super(props);
    this.highlighter = new Highlighter(document.body);
    // This event subscription will last irrespective of whether annotations are redrawn or not
    this.highlighter.onHighlightEvent('mouseover', this.showViewer);
  }

  showViewer = (e, annotations) => {
    const position = mousePosition(e);
    this.props.showViewer(
      position.x,
      position.y,
      annotations.map(annotation => annotation.annotationId),
    );
  }

  drawAll() {
    // For each annotation, it is cleared and drawn again
    this.highlighter.drawAll(this.props.annotations.map(annotation => ({
      id: annotation.annotationId,
      range: annotation.range,
      annotationData: annotation,
    })));
  }

  componentDidMount() {
    this.drawAll();
  }

  componentDidUpdate() {
    this.drawAll();
  }

  render() {
    return null;
  }
}
