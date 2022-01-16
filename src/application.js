import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import render from './view';
import ru from './locales/ru';

yup.setLocale({
  string: {
    url: () => ({ key: 'invalidUrl' }),
  },
  mixed: {
    notOneOf: () => ({ key: 'notUniqueUrl' }),
  },
});

const app = (i18nIntance) => {
  const elements = {
    container: document.querySelector('.container-fluid'),
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    submitButton: document.querySelector('input[type="submit"]'),
    urlExample: document.querySelector('.text-muted'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    locale: 'ru',
    data: {
      urls: [],
      urlToAdd: '',
    },
    additionProcess: {
      // formState: '', // sent, error, sending, filling
      validationState: '', // valid / invalid
      errorDescPath: '',
    },
  };

  const watchedState = onChange(state, render(i18nIntance, state, elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.data.urlToAdd = formData.get('url');
    yup.string()
      .url()
      .notOneOf(state.data.urls)
      .validate(state.data.urlToAdd)
      .then(() => {
        state.data.urls.push(state.data.urlToAdd);
        watchedState.additionProcess.validationState = 'valid';
      })
      .catch((err) => {
        const [{ key }] = err.errors;
        state.additionProcess.errorDescPath = `addRssUrlForm.errors.${key}`;
        watchedState.additionProcess.validationState = 'invalid';
      });
  });
};

const runApp = () => {
  const i18nextIntance = i18next.createInstance();
  i18nextIntance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => app(i18nextIntance));
};

export default runApp;
