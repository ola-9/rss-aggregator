/* eslint-disable no-param-reassign */
// import downloadRssfrom './parser';

import axios from 'axios';
import _ from 'lodash';

const trackUpdates = (state, watchedState) => {
  console.log('updating feeds');
  state.data.urls.forEach((url) => {
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${url}`)}`)
      .then((response) => {
        const parser = new DOMParser();
        const parsedRSS = parser.parseFromString(response.data.contents, 'text/xml');
        return parsedRSS;
      })
      .then((data) => {
        const [{ id }] = state.feedsData.feeds.filter((feed) => feed.url === url);
        console.log('feed id: ', id);
        const posts = [...data.querySelectorAll('item')]
          .map((post) => {
            const postTitle = post.querySelector('title').textContent;
            const postUrl = post.querySelector('link').textContent;
            const postId = _.uniqueId('post_');
            return {
              postId, postTitle, postUrl, feedId: id,
            };
          });
        console.log('posts from state before update: ', state.feedsData.posts);
        const postsToRender = posts
          .filter(({ postTitle: title1 }) => !state.feedsData.posts
            .some(({ postTitle: title2 }) => title2 === title1));
        console.log('postsToRender', postsToRender);
        state.update.postsToRender = postsToRender;
        state.feedsData.posts = state.feedsData.posts.concat(postsToRender);
        console.log('posts from state after update: ', state.feedsData.posts);
        watchedState.update.updateState = 'updated';
        state.update.updateState = '';
        state.update.postsToRender = '';
      })
      .catch((error) => {
        console.log('Network error>>>>', error);
      });
  });

  setTimeout(() => trackUpdates(state, watchedState), 5000);
  // setTimeout(trackUpdates, 5000);
};

export default trackUpdates;
