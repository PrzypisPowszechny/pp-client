

export interface AnnotationService {
  create(annotation: {}): Promise<{}>,
  update(annotation: {}): Promise<{}>,
  get(id: number): Promise<{}>,
  delete(id: number): Promise<{}>,
}



