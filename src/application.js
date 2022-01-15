import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import render from './view';
import ru from './locales/ru';

const schema = yup.object().shape({
  url: yup.string().url(),
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
    urls: [],
    form: {
      url: '',
    },
    additionProcess: {
      errorDesc: '',
      errorType: '',
      // state: '', // sent, error, sending, filling
      validationState: '', // valid / invalid
    },
  };

  const watchedState = onChange(state, render(i18nIntance, state, elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.url = formData.get('url');
    schema.validate({ url: state.url })
      .then((newUrl) => {
        if (!state.urls.includes(newUrl.url)) {
          state.urls.push(newUrl.url);
          state.form.url = '';
          state.additionProcess.errorDesc = '';
          state.additionProcess.errorType = '';
          watchedState.additionProcess.validationState = 'valid';
        } else {
          state.additionProcess.validationState = 'invalid';
          state.additionProcess.errorDesc = 'addRssUrlForm.errors.notUnique';
          watchedState.additionProcess.errorType = 'notUnique';
        }
      })
      .catch(() => {
        state.additionProcess.validationState = 'invalid';
        state.additionProcess.errorDesc = 'addRssUrlForm.errors.invalidUrl';
        watchedState.additionProcess.errorType = 'invalid';
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
