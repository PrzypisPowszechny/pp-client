import React from 'react';
import { connect } from 'react-redux';

import { AnnotationRequestAPIModel } from 'common/api/annotation-requests';
import {
  AnnotationAPICreateModel,
  AnnotationAPIModel,
  AnnotationAPIModelUpdatableAttrs,
  AnnotationAPIUpdateModel,
} from 'common/api/annotations';
import ppGa from 'common/pp-ga';
import { selectTab } from 'common/store/tabs/selectors';
import { createResource, updateResource } from 'common/store/tabs/tab/api/actions';
import { selectAnnotation, selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import { changeNotification, hideAnnotationForm } from 'common/store/tabs/tab/widgets/actions';

import AnnotationFormContent from './AnnotationFormContent';

import { ToastType } from '../elements/Toast/Toast';

export interface AnnotationFormProps {
  annotationRequest: AnnotationRequestAPIModel;
  annotation?: AnnotationAPIModel;

  hideAnnotationForm: () => void;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
  createAnnotation: (instance: AnnotationAPICreateModel) => Promise<{ data: AnnotationAPIModel }>;
  updateAnnotation: (instance: AnnotationAPIUpdateModel) => Promise<{ data: AnnotationAPIModel }>;
}

@connect(
  (state) => {
    const { annotationId, annotationRequestId } = selectTab(state).widgets.annotationForm;
    if (annotationId) {
      const annotation = selectAnnotation(state, annotationId);
      return {
        annotation,
        annotationRequest: selectAnnotationRequest(state, annotation.relationships.annotationRequest.data.id),
      };
    } else { return {
        annotation: null,
        annotationRequest: selectAnnotationRequest(state, annotationRequestId),
      };
    }
  },
  {
    hideAnnotationForm,
    changeNotification,
    createAnnotation: createResource,
    updateAnnotation: updateResource,
  },
)
export default class AnnotationForm extends React.Component<Partial<AnnotationFormProps>> {

  getAnnotationForPatchUpdate(formData: AnnotationAPIModelUpdatableAttrs): AnnotationAPIUpdateModel {
    return {
        id: this.props.annotation.id,
        type: this.props.annotation.type,
        attributes: formData,
      };
  }

  getAnnotationFromAnnotationRequest(formData: AnnotationAPIModelUpdatableAttrs): AnnotationAPICreateModel {
    const { url, range, quote, quoteContext } = this.props.annotationRequest.attributes;

    return {
      type: 'annotations',
      attributes: {
        // Some fields are exact copy from annotationRequest
        url, range, quote, quoteContext,
        // While other get filled in the form
        ...formData,
      },
      relationships: {
        annotationRequest: {
          data: {
            type: 'annotationRequests',
            id: this.props.annotationRequest.id,
          },
        },
      },
    };
  }

  handleSubmit = (formData: AnnotationAPIModelUpdatableAttrs) => {
    let query;
    if (this.props.annotation) {
      query = this.props.updateAnnotation(this.getAnnotationForPatchUpdate(formData));
    } else {
      query = this.props.createAnnotation(this.getAnnotationFromAnnotationRequest(formData));
    }

    query.then((jsonData) => {
      this.props.hideAnnotationForm();
      this.props.changeNotification(true, 'Zapisano odpowiedź na prośbę o przypis', ToastType.success);
      const instance = jsonData.data;
      const { comment, ppCategory, annotationLink } = instance.attributes;
      const triggerGaEvent = this.props.annotation ? ppGa.annotationEdited : ppGa.annotationAdded;
      triggerGaEvent(instance.id, ppCategory, !comment, annotationLink);
    }).catch((error) => {
      this.props.changeNotification(true, 'Błąd! Nie udało się zapisać', ToastType.failure);
      throw new Error(`Failed to submit annotation form: ${error}`);
    });
  }

  handleCancel = () => {
    this.props.hideAnnotationForm();
  }

  getKey() {
    return `${this.props.annotation ? this.props.annotation.id : null}.${this.props.annotationRequest.id}`;
  }

  getInitialAnnotationData() {
    if (!this.props.annotation) {
      return null;
    }
    return {
      comment: this.props.annotation.attributes.comment,
      ppCategory: this.props.annotation.attributes.ppCategory,
      annotationLink: this.props.annotation.attributes.annotationLink,
      annotationLinkTitle: this.props.annotation.attributes.annotationLinkTitle,
    };
  }

  render() {
    return (
      <AnnotationFormContent
        initialData={this.getInitialAnnotationData()}
        annotation={this.props.annotation}
        annotationRequest={this.props.annotationRequest}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}

        key={this.getKey()}
      />
    );
  }
}
