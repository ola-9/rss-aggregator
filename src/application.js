import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import render from './view';
import ru from './locales/ru';

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
      state: '', // sent, error, sending, filling
      validationState: '', // valid / invalid
    },
  };

  const watchedState = onChange(state, render(i18nIntance, state, elements));

  yup.setLocale({
    url: () => ({ key: 'invalidUrl' }),
    notOneOf: () => ({ key: 'notUnique' }),
  });

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
        console.log('err.errors: ', err.errors);
        console.log('keys:', Object.entries(err));
        console.log('err.name: ', err.name);
        console.log('err.message:', err.message);
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
