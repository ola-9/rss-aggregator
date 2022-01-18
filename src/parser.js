/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';

const getData = (data) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const id = _.uniqueId('feed_');
  const feed = { title, description, id };
  const posts = [...data.querySelectorAll('item')]
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postUrl = item.querySelector('link').textContent;
      const postId = _.uniqueId('post_');
      return {
        postId, postTitle, postUrl, feedId: id,
      };
    });
  return [feed, posts];
};

const downloadRss = (state, watchedState) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.data.urlToAdd}`)}`)
    .then((response) => {
      const parser = new DOMParser();
      const parsedRSS = parser.parseFromString(response.data.contents, 'text/xml');
      state.additionProcess.successDescPath = 'addRssUrlForm.uploadSuccessMsg';
      // watchedState.additionProcess.validationState = 'valid';
      return parsedRSS;
    })
    .then((data) => {
      const [feed, posts] = getData(data);
      posts.forEach((post) => state.feedsData.posts.push(post));
      state.feedsData.currentFeedId = feed.id;
      // console.log('currentFeedId: ', state.feedsData.currentFeedId);
      state.feedsData.feeds.push(feed);
      watchedState.additionProcess.validationState = 'valid';
      state.additionProcess.validationState = '';
    })
    .catch((error) => { // typeError - not valid RSS, networkError: Ошибка сети
      console.log('error.name: ', error.name);
      switch (error.name) {
        case 'Error': {
          state.additionProcess.errorDescPath = 'addRssUrlForm.networkError';
          watchedState.additionProcess.validationState = 'invalid';
          state.additionProcess.validationState = '';
          break;
        }
        case 'TypeError': {
          state.additionProcess.errorDescPath = 'addRssUrlForm.invalidRss';
          watchedState.additionProcess.validationState = 'invalid';
          state.additionProcess.validationState = '';
          break;
        }
        default:
          throw new Error(`unknown error ${error}`);
      }
    });
};

export default downloadRss;
