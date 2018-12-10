import React, { ChangeEvent } from 'react';
import { saveAnnotationRequest } from '../../common/api/utils';

export interface AnnotationRequestFormData {
  url: string;
  quote: string;
  comment: string;
  notificationEmail: string;
}

export interface AnnotationRequestFormProps {
  formData: Partial<AnnotationRequestFormData>;
}

interface AnnotationRequestFormState extends AnnotationRequestFormData {
  isSent: boolean;
}

export default class AnnotationRequestForm extends React.Component<AnnotationRequestFormProps,
  Partial<AnnotationRequestFormState>> {

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isSent: false,
      ...nextProps.formData,
    };
  }

  constructor(props: AnnotationRequestFormProps) {
    super(props);

    this.state = { ...props.formData };
  }

  handleSubmit = (e) => {
    const { url, quote, comment, notificationEmail } = this.state;

    // TODO validate
    saveAnnotationRequest({
      url, quote, comment, notificationEmail,
    }).then((response) => {
      console.log('annotation request sent!');
      this.setState({ isSent: true });
    });
  }

  render() {
    const { url, quote, comment, notificationEmail } = this.state;
    if (this.state.isSent) {
      return (
        <div> Dziękujemy za zgłoszenie! </div>
      );
    } else {
      return (
        // TODO make a form
        <div> {url}, {quote}, {comment}, {notificationEmail}
          <button onClick={this.handleSubmit}> Wyślij</button>
        </div>
      );
    }
  }

}
