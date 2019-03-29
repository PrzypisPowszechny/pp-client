const notificationEmailMaxLength = 2048;
const commentMaxLength = 1000;
const quoteMaxLength = 1000;

interface ValidatorValues {
  comment: string;
  quote: string;
}

interface ValidatorResult {
  valid: boolean;
  errors: {
    commentError?: string;
    quoteError?: string;
  };
}

// tslint:enable:max-line-length

function validateEmail(email) {
  // tslint:disable:max-line-length
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // tslint:enable:max-line-length
  return re.test(email);
}

export function validateAnnotationRequestForm(values: ValidatorValues): ValidatorResult {
  const {
    comment,
    quote,
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

  if (!quote) {
    result.errors = { quoteError: 'Podaj fragment artykułu' };
    return result;
  } else if (quote.length > quoteMaxLength) {
    result.errors = { quoteError: `Skróć komentarz z ${quote.length} do ${quoteMaxLength} znaków!` };
    return result;
  }

  result.valid = true;
  return result;
}
