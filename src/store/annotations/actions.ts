export const CREATE_ANNOTATION = 'CREATE_ANNOTATION';

export const createAnnotation = (annotation) => {
  return {
    type: CREATE_ANNOTATION,
    payload: annotation,
  };
};
