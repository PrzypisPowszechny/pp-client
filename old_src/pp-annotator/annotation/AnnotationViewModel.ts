import annotator from 'annotator';
import {AnnotationPriorities} from 'pp-annotator/consts';
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
  createDate: Date | null;
  doesBelongToUser: boolean;

  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;

  // Fields viewed / modified by the user
  objection: boolean;
  objectionCount: number;
  useful: boolean;
  usefulCount: number;

  constructor(annotationAPIModel?: IAnnotationAPIModel) {
    const model: any = annotationAPIModel || {};
    this.url = model.url || '';
    if (model.create_date) {
      this.createDate = new Date(model.create_date);
    } else {
      this.createDate = null;
    }
    this.doesBelongToUser = model.does_belong_to_user || false;
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