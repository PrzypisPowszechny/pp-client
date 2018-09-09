import { APIModel } from './json-api';

export enum DemagogAnnotationCategories {
  TRUE = 'TRUE',
}

export interface DemagogAnnotationAPIModel extends APIModel {
  attributes: DemagogAnnotationAPIModelAttrs;
}

export interface DemagogAnnotationAPIModelAttrs {
  text: string;
  url: string;
  sclass: DemagogAnnotationCategories;
  date: string;
  rating_text: string;
}
