import { isValidUrl } from 'common/url';

const linkTitleMaxLength = 110;
const linkMaxLength = 2048;
const commentMaxLength = 1000;

interface ValidatorValues {
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

interface ValidatorResult {
  valid: boolean;
  errors: {
    commentError?: string;
    annotationLinkError?: string;
    annotationLinkTitleError?: string;
  };
}

export function validateAnnotationForm(
  { comment, annotationLink, annotationLinkTitle }: ValidatorValues,
): ValidatorResult {
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
  if (!annotationLinkTitle) {
    result.errors = { annotationLinkTitleError: 'Musisz podać tytuł źródła, jeśli chcesz dodać przypis!' };
    return result;
  } else if (annotationLinkTitle.length > linkTitleMaxLength) {
    result.errors = {
      annotationLinkTitleError: `Skróć tytuł źródła z ${annotationLinkTitle.length} do ${linkTitleMaxLength} znaków!`,
    };
    return result;
  }

  result.valid = true;
  return result;
}
