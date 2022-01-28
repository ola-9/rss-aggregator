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
  return { feed, posts };
};

const downloadRss = (state, watchedState) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.data.urlToAdd}`)}`)
    .then((response) => {
      const parser = new DOMParser();
      const parsedRSS = parser.parseFromString(response.data.contents, 'text/xml');
      state.processState.success = 'addRssUrlForm.uploadSuccessMsg';
      const { feed, posts } = getData(parsedRSS, state.data.urlToAdd);
      posts.forEach((post) => state.data.posts.push(post));
      state.data.currentFeedId = feed.id;
      state.data.feeds.push(feed);
      console.log('state.data: >>>>', state.data);
      watchedState.processState.addition = 'completed';
      state.processState.addition = null;
    })
    .catch((error) => {
      state.processState.error = `addRssUrlForm.${error.name}`;
      watchedState.processState.addition = 'invalid';
      state.processState.addition = null;
    });
};

export default downloadRss;
