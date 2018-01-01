import annotator from 'annotator';
import {AnnotationPriorities} from '../consts';
import IAnnotationAPIModel from './IAnnotationAPIModel';
import {IAnnotationForm} from './annotation';

export default class AnnotationViewModel implements IAnnotationForm, annotator.IAnnotation {
  static fromSelection(selection: annotator.IAnnotation, url: string) {
    const viewModel = new AnnotationViewModel();
    viewModel.url = url;
    viewModel.quote = selection.quote;
    viewModel.ranges = selection.ranges;
    return viewModel;
  }

  static toModel(viewModel: AnnotationViewModel): IAnnotationAPIModel {
    return {
      id: viewModel.id,
      url: viewModel.url,
      ranges: viewModel.ranges,
      quote: viewModel.quote,

      priority: viewModel.priority,
      comment: viewModel.comment,
      reference_link: viewModel.referenceLink,
      reference_link_title: viewModel.referenceLinkTitle,
    };
  }

  id: number;
  quote: string;
  ranges: any[]; // TODO type this better
  url: string;

  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;

  // Fields viewed / modified by the user
  objection: boolean;
  objectionCount: number;
  useful: boolean;
  usefulCount: number;

  constructor(model?: IAnnotationAPIModel) {
    model = model || {};

    this.url = model.url || '';
    this.quote = model.quote || '';
    this.ranges = model.ranges || [];
    this.id = model.id || 0;
    this.priority = model.priority || AnnotationPriorities.NORMAL;
    this.comment = model.comment || '';
    this.referenceLink = model.reference_link || '';
    this.referenceLinkTitle = model.reference_link_title || '';
    this.objection = model.objection || false;
    this.objectionCount = model.objection_count || 0;
    this.useful = model.useful || false;
    this.usefulCount = model.useful_count || 0;
  }
}
