import { isValidUrl } from 'common/url';

const linkTitleMaxLength = 110;
const linkMaxLength = 2048;
const commentMaxLength = 1000;

interface ValidatorValues {
  comment: string;
  annotationLink: string;
  linkTitle: string;
}

interface ValidatorResult {
  valid: boolean;
  errors: {
    commentError?: string;
    annotationLinkError?: string;
    annotationLinkTitleError?: string;
  };
}

export function validateEditorForm(values: ValidatorValues): ValidatorResult {
  const {
    comment,
    annotationLink,
    linkTitle,
  } = values;

  const result: ValidatorResult = {
    valid: false,
    errors: {},
  };

  if (comment) {
    if (comment.length > commentMaxLength) {
      result.errors = { commentError: `Skróć komentarz z ${comment.length} do ${commentMaxLength} znaków!` };
      return result;
    }
  }
  if (!annotationLink) {
    result.errors = { annotationLinkError: 'Musisz podać źródło, jeśli chcesz dodać przypis!' };
    return result;
  } else if (annotationLink.length > linkMaxLength) {
    result.errors = { annotationLinkError: `Skróć źródło z ${annotationLink.length} do ${linkMaxLength} znaków!` };
    return result;
  } else if (!isValidUrl(annotationLink)) {
    result.errors = { annotationLinkError: 'Podaj poprawny link do źródła!' };
    return result;
  }
  if (!linkTitle) {
    result.errors = { annotationLinkTitleError: 'Musisz podać tytuł źródła, jeśli chcesz dodać przypis!' };
    return result;
  } else if (linkTitle.length > linkTitleMaxLength) {
    result.errors = {
      annotationLinkTitleError: `Skróć tytuł źródła z ${linkTitle.length} do ${linkTitleMaxLength} znaków!`,
    };
    return result;
  }

  result.valid = true;
  return result;
}
