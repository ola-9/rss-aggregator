import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
// import axios from 'axios';
import render from './view';
import ru from './locales/ru';
import downloadRss from './parser';

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
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = {
    locale: 'ru',
    feedsData: {
      feeds: [],
      posts: [],
      currentFeedId: '',
    },
    data: {
      urls: [], // https://www.cnews.ru/inc/rss/news.xml
      urlToAdd: '', // https://ru.hexlet.io/lessons.rss
    }, // http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
    additionProcess: {
      validationState: '', // valid / invalid
      errorDescPath: '',
      successDescPath: '',
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
        downloadRss(state, watchedState);
      })
      .catch((err) => {
        const [{ key }] = err.errors;
        state.additionProcess.errorDescPath = `addRssUrlForm.errors.${key}`;
        watchedState.additionProcess.validationState = 'invalid';
        state.additionProcess.validationState = ''; // to check
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
