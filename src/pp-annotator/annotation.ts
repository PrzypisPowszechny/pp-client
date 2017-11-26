import {AnnotationPriorities} from "./consts";
import * as annotator from 'annotator';

export interface IAnnotationBase extends annotator.IAnnotation {
    url: string;
}

// Fields edited by the user in the form
export interface IAnnotationFields {
    priority: AnnotationPriorities;
    comment: string;
    referenceLink: string;
    referenceLinkTitle: string;
}

//Annotation data sent to the server
type IAnnotationForm = IAnnotationBase & IAnnotationFields

//Full flat API data model
export interface IAnnotationAPIModel {
    id?: number;
    url?: string;
    ranges?: any[];
    quote?: string;

    priority?: AnnotationPriorities;
    comment?: string;
    reference_link?: string;
    reference_link_title?: string;

    objection?: boolean;
    objection_count?: number;
    useful?: boolean;
    useful_count?: number;
}

export default IAnnotationAPIModel;

export class AnnotationViewModel implements IAnnotationForm, annotator.IAnnotation {
    public id: number;
    public quote: string;
    public ranges: any[]; // TODO type this better
    public url: string;

    public priority: AnnotationPriorities;
    public comment: string;
    public referenceLink: string;
    public referenceLinkTitle: string;

    // Fields viewed / modified by the user
    public objection: boolean;
    public objectionCount: number;
    public useful: boolean;
    public usefulCount: number;

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
        this.usefulCount = model.useful_count || 0
    }

    public static fromSelection(selection: annotator.IAnnotation, url: string) {
        const viewModel = new AnnotationViewModel();
        viewModel.url = url;
        viewModel.quote = selection.quote;
        viewModel.ranges = selection.ranges;
        return viewModel;
    }

    public static toModel(viewModel: AnnotationViewModel): IAnnotationAPIModel {
        return {
            id: viewModel.id,
            url: viewModel.url,
            ranges: viewModel.ranges,
            quote: viewModel.quote,
        
            priority: viewModel.priority,
            comment: viewModel.comment,
            reference_link: viewModel.referenceLink,
            reference_link_title: viewModel.referenceLinkTitle
        }
    }
}