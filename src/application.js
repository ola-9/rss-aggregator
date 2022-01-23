import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import render from './view';
import ru from './locales/ru';
import downloadRss from './parser';
import trackUpdates from './update';

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

  // console.log(elements.addButton);

  const state = {
    locale: 'ru',
    postsState: {
      modalState: '', // open, closed,
      readPostsIds: [],
      lastReadPostId: '',
    },
    update: {
      updateState: '',
      postsToRender: [],
    },
    // updateState: '',
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
      submisionStatus: '',
      validationState: '', // valid / invalid
      errorDescPath: '',
      successDescPath: '',
    },
  };
  const watchedState = onChange(state, render(i18nextIntance, state, elements));

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
        watchedState.additionProcess.submisionStatus = 'receiving';
        downloadRss(state, watchedState);
        // watchedState.additionProcess.submisionStatus = 'received';
      })
      .catch((err) => {
        const [{ key }] = err.errors;
        state.additionProcess.errorDescPath = `addRssUrlForm.errors.${key}`;
        watchedState.additionProcess.validationState = 'invalid';
        state.additionProcess.validationState = ''; // to check
      });
  });

  trackUpdates(state, watchedState);

  elements.modal.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const id = button.getAttribute('data-id');
    state.postsState.lastReadPostId = id;
    state.postsState.readPostsIds.push(id);
    watchedState.postsState.modalState = 'previewPost';
    state.postsState.modalState = ''; // ???
  });

  elements.posts.addEventListener('click', (e) => {
    console.log(e.target.dataset.id);
    // console.log(e);
    if (e.target.className === 'fw-bold') {
      const { id } = e.target.dataset;
      state.postsState.lastReadPostId = id;
      state.postsState.readPostsIds.push(id);
      watchedState.postsState.modalState = 'openPost';
      state.postsState.modalState = ''; // ???
      // const readPost = elements.posts.querySelector(`a[data-id=${id}`);
      // console.log(readPost);
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
// export default app;
