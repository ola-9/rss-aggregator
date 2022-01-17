import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import render from './view';
import ru from './locales/ru';
import parseData from './parser';

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
    // dataContainer: document.querySelector('.conraiiner-xxl'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = {
    locale: 'ru',
    feedsData: {
      feeds: [],
      posts: [],
    },
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
  // const watchedStateFeeds = onChange(state.feedsData, renderFeeds(state, elements));

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
        axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.data.urlToAdd}`)}`)
          .then((response) => {
            const parser = new DOMParser();
            const parsedRSS = parser.parseFromString(response.data.contents, 'text/xml');
            return parsedRSS;
          })
          .then((data) => {
            const [feed, posts] = parseData(data);
            console.log('feed: ', feed);
            console.log('potst: ', posts);
            posts.forEach((post) => state.feedsData.posts.push(post));
            watchedState.feedsData.feeds.push(feed);
            // console.log(state.feedsData.feeds, state.feedsData.posts);
          })
          .catch((error) => console.log(error));
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
