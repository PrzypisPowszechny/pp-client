// annotation that is highlighted via quote
import { APIModel } from './json-api';

export interface QuoteAnnotationAPIModel extends APIModel {
  attributes: {
    quote: string;
  };
}
