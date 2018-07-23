import { isValidUrl } from 'utils/url';

const linkTitleMaxLength = 110;
const linkMaxLength = 2048;
const commentMaxLength = 1000;

interface ValidatorValues {
  comment: string;
  link: string;
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
    link,
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
  if (!link) {
    result.errors = { annotationLinkError: 'Musisz podać źródło, jeśli chcesz dodać przypis!' };
    return result;
  } else if (link.length > linkMaxLength) {
    result.errors = { annotationLinkError: `Skróć źródło z ${link.length} do ${linkMaxLength} znaków!` };
    return result;
  } else if (!isValidUrl(link)) {
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
