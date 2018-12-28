const notificationEmailMaxLength = 2048;
const commentMaxLength = 1000;
const quoteMaxLength = 1000;

interface ValidatorValues {
  comment: string;
  quote: string;
  notificationEmail: string;
}

interface ValidatorResult {
  valid: boolean;
  errors: {
    commentError?: string;
    quoteError?: string;
    notificationEmailError?: string;
  };
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validateAnnotationRequestForm(values: ValidatorValues): ValidatorResult {
  const {
    comment,
    quote,
    notificationEmail,
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

  if (notificationEmail) {
    if (notificationEmail.length > notificationEmailMaxLength) {
      result.errors = {
        notificationEmailError:
          `Skróć email z ${notificationEmail.length} do ${notificationEmailMaxLength} znaków!`,
      };
      return result;
    }
    if (!validateEmail(notificationEmail)) {
      result.errors = {
        notificationEmailError:
          `Email nie jest poprawny`,
      };
      return result;
    }
  }

  result.valid = true;
  return result;
}
