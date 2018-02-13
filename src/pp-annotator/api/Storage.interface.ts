import {IAnnotationAPIModel} from '../annotation/IAnnotationAPIModel';

export default interface IStorage {
  create(annotation: IAnnotationAPIModel): IAnnotationAPIModel;
  update(annotation: IAnnotationAPIModel): IAnnotationAPIModel;
  delete(annotation: IAnnotationAPIModel): IAnnotationAPIModel;
  query(id?: number): IAnnotationAPIModel[];
}
