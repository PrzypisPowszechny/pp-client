import IAnnotation from './Annotation.interface';

export default interface IStorage {
  create(annotation: IAnnotation): IAnnotation;
  update(annotation: IAnnotation): IAnnotation;
  delete(annotation: IAnnotation): IAnnotation;
  query(id: number): IAnnotation;
}
