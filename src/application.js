import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import render from './view';
import ru from './locales/ru';
import trackUpdates from './update';
import parseData from './parser';
import getProxyUrl from './util';
import { getFeed, getPosts } from './data';

const validateUrl = (urlToAdd, urls) => yup.string()
  .url()
  .notOneOf(urls)
  .validate(urlToAdd);

const app = (i18nextIntance) => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'invalidUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'notUniqueUrl' }),
    },
  });

  const elements = {
    body: document.querySelector('body'),
    container: document.querySelector('.container-fluid'),
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    addButton: document.querySelector('button[type="submit"]'),
    urlExample: document.querySelector('.text-muted'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: document.getElementById('modal'),
  };

  const state = {
    locale: 'ru',

    data: { // http://lorem-rss.herokuapp.com/feed?unit=second&interval=05
      urls: [], // https://www.cnews.ru/inc/rss/news.xml
      urlToAdd: '', // https://ru.hexlet.io/lessons.rss
      feeds: [],
      posts: [],
      currentFeedId: '',
      readPostsIds: [],
      lastReadPostId: '',
      postsToRender: [],
    },
    processState: {
      validation: '',
      addition: '',
      message: '',
      modal: '',
      updating: '',
    },
  };

  const watchedState = onChange(state, render(i18nextIntance, state, elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.data.urlToAdd = formData.get('url');
    validateUrl(state.data.urlToAdd, state.data.urls)
      .then(() => {
        state.data.urls.push(state.data.urlToAdd);
        watchedState.processState.addition = 'receiving';
        axios.get(getProxyUrl(state.data.urlToAdd))
          .then((response) => {
            const data = parseData(response);
            const feed = getFeed(data, state.data.urlToAdd);
            const posts = getPosts(data, feed.id);
            state.data.feeds.push(feed);
            state.data.posts = state.data.posts.concat(posts);
            state.data.currentFeedId = feed.id;
            state.processState.message = 'addRss.uploadSuccessMsg';
            watchedState.processState.addition = 'received';
          })
          .catch((error) => {
            state.processState.message = `addRss.${error.name}`;
            watchedState.processState.addition = 'error';
            state.processState.addition = null;
          });
      })
      .catch((err) => {
        const [{ key }] = err.errors;
        state.processState.message = `addRss.errors.${key}`;
        watchedState.processState.validation = 'error';
        state.processState.validation = null;
      });
  });

  trackUpdates(state, watchedState);

  elements.posts.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    state.data.lastReadPostId = id;
    state.data.readPostsIds.push(id);
    if (e.target.className === 'fw-bold') {
      watchedState.processState.modal = 'openPost';
      state.processState.modal = null;
    }

    if (e.target.dataset.bsTarget === '#modal') {
      watchedState.processState.modal = 'previewPost';
      state.processState.modal = null;
    }
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
