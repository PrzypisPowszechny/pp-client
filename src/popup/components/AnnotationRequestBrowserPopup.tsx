import React, { ChangeEvent } from 'react';
import AnnotationRequestForm, { AnnotationRequestFormData, AnnotationRequestFormProps } from './AnnotationRequestForm';
import { ANNOTATION_REQUEST_FORM_DATA } from '../../common/chrome-storage/keys';

interface AnnotationRequestBrowserPopupState {
  formData: AnnotationRequestFormData;
}

export default class AnnotationRequestBrowserPopup extends React.Component<{}, Partial<AnnotationRequestBrowserPopupState>> {
  constructor(props: {}) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    chrome.storage.local.get([ANNOTATION_REQUEST_FORM_DATA], (result) => {
      this.setState({ formData: result[ANNOTATION_REQUEST_FORM_DATA] });
      console.log(result[ANNOTATION_REQUEST_FORM_DATA]['url']);
    });
  }

  render() {
    return (<AnnotationRequestForm formData={this.state.formData}/>);
  }

}
