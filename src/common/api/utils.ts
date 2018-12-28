import { AnnotationRequestAPICreateModel, AnnotationRequestAttributes } from './annotation-requests';
import axios from 'axios';

export function saveAnnotationRequest(attributes: AnnotationRequestAttributes) {
  const data: AnnotationRequestAPICreateModel = {
    type: 'annotation_requests',
    attributes,
  };
  return axios({
    method: 'post',
    url: `${PPSettings.API_URL}/annotationRequests`,
    data: { data },
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  });
}
