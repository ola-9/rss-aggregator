/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import render from './view';
import ru from './locales/ru';
import trackUpdates from './update';
import parseData from './parser';
import getProxyUrl from './util';

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

    update: {
      updateState: '',
      postsToRender: [],
    },

    data: { // http://lorem-rss.herokuapp.com/feed?unit=second&interval=05
      urls: [], // https://www.cnews.ru/inc/rss/news.xml
      urlToAdd: '', // https://ru.hexlet.io/lessons.rss
      feeds: [],
      posts: [],
      currentFeedId: '',
      readPostsIds: [],
      lastReadPostId: '',
    },
    processState: {
      validation: '',
      addition: '',
      error: '',
      success: '',
      modal: '',
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
        const url = getProxyUrl(state.data.urlToAdd);
        axios.get(url)
          .then((response) => {
            const { feed, posts } = parseData(response);
            feed.url = state.data.urlToAdd;
            feed.id = _.uniqueId('feed_');
            posts.forEach((post) => {
              post.id = _.uniqueId('post_');
              post.feedId = feed.id;
            });
            state.data.feeds.push(feed);
            state.data.posts = state.data.posts.concat(posts);
            state.data.currentFeedId = feed.id;
            state.processState.success = 'addRssUrlForm.uploadSuccessMsg';
            watchedState.processState.addition = 'received';
            // console.log('state.data.posts:', state.data.posts);
          })
          .catch((error) => {
            state.processState.error = `addRssUrlForm.${error.name}`;
            watchedState.processState.addition = 'error';
            state.processState.addition = null;
          });
      })
      .catch((err) => {
        const [{ key }] = err.errors;
        state.processState.error = `addRssUrlForm.errors.${key}`;
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
