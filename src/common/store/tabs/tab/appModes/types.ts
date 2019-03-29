
export interface AnnotationRequestFormData {
  quote: string;
  comment: string;
}

export interface AppModes {
  isExtensionDisabled: boolean;
  annotationModePages: string[];
  requestModePages: string[];
  requestModeFormData: Partial<AnnotationRequestFormData>;
  disabledPages: string[];
}
