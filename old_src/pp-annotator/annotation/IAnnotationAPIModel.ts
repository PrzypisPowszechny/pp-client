import { AnnotationPriorities } from 'old_src/pp-annotator/consts';

// Full flat API data model
// TODO: its structure needs updating after backend API changes (we'll fix it together with the storage change)
export interface IAnnotationAPIModel {
  id: number;
  url?: string;
  ranges?: any[];
  quote?: string;
  create_date?: string;
  does_belong_to_user?: boolean;

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
