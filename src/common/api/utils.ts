import { AnnotationRequestAttributes } from './annotation-requests';
import axios from 'axios';

export function saveAnnotationRequest(attributes: AnnotationRequestAttributes) {
  return axios({
    method: 'post',
    url: `${PPSettings.API_URL}/annotationRequests`,
    data: {
      data: { attributes, },
    },
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  });
}
