/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';

const getData = (data, url) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const id = _.uniqueId('feed_');
  const feed = {
    title, description, id, url,
  };
  const posts = [...data.querySelectorAll('item')]
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postUrl = item.querySelector('link').textContent;
      const postDesc = item.querySelector('description').textContent;
      const postId = _.uniqueId('post_');
      return {
        postId, postTitle, postUrl, postDesc, feedId: id,
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
      watchedState.additionProcess.submisionStatus = 'received';
      return parsedRSS;
    })
    .then((data) => {
      const [feed, posts] = getData(data, state.data.urlToAdd);
      posts.forEach((post) => state.feedsData.posts.push(post));
      state.feedsData.currentFeedId = feed.id;
      state.feedsData.feeds.push(feed);
      watchedState.additionProcess.validationState = 'valid';
      state.additionProcess.validationState = '';
    })
    .catch((error) => {
      state.additionProcess.errorDescPath = `addRssUrlForm.${error.name}`;
      watchedState.additionProcess.validationState = 'invalid';
      state.additionProcess.validationState = '';
    });
};

export default downloadRss;
