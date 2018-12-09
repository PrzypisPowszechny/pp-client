import React, { ChangeEvent } from 'react';
import { saveAnnotationRequest } from '../../common/api/utils';

export interface AnnotationRequestFormData {
  url: string;
  quote: string;
  comment: string;
  notificationEmail: string;
}

export interface AnnotationRequestFormProps {
  formData: AnnotationRequestFormData;
}

interface AnnotationRequestFormState extends AnnotationRequestFormData {
  isSent: boolean;
}

export default class AnnotationRequestForm extends React.Component<Partial<AnnotationRequestFormProps>,
  Partial<AnnotationRequestFormState>> {

  static getDerivedStateFromProps(nextProps, prevState) {
    return { ...nextProps.formData };
  }

  constructor(props: {}) {
    super(props);

    this.state = { ...props };
  }

  handleSubmit = (e) => {
    const { url, quote, comment, notificationEmail } = this.state;

    // TODO validate
    saveAnnotationRequest({
      url, quote, comment, notificationEmail,
    }).then((response) => {
      // TODO notify
      console.log('annotation request sent!');
    });


  }

  render() {
    // TODO
    const { url, quote, comment, notificationEmail } = this.state;
    return (
      <div> {url}, {quote}, {comment}
      <button onClick={this.handleSubmit}> Wyślij </button>
      </div>
    );
  }

}
