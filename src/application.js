import onChange from 'on-change';
import * as yup from 'yup';
import render from './view';

const schema = yup.object().shape({
  url: yup.string().url(),
});

const app = () => {
  const elements = {
    container: document.querySelector('.container-fluid'),
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    submitButton: document.querySelector('input[type="submit"]'),
    urlExample: document.querySelector('.text-muted'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    urls: [],
    form: {
      url: '',
    },
    additionProcess: {
      errorDesc: '', // error description
      state: '', // sent, error, sending, filling
      // validationState: '', // valid / invalid
    },
  };

  const watchedState = onChange(state, render(state, elements));

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
          watchedState.additionProcess.state = 'valid';
        } else {
          state.additionProcess.errorDesc = 'RSS уже существует';
          watchedState.additionProcess.state = 'error';
          state.additionProcess.state = 'filling';
        }
      })
      .catch(() => {
        state.additionProcess.errorDesc = 'Ссылка должна быть валидным URL';
        watchedState.additionProcess.state = 'error';
        state.additionProcess.state = 'filling';
      });
  });
};

export default app;
