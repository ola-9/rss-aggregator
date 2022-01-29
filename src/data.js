import _ from 'lodash';

const getFeed = (data, url) => (
  {
    title: data.feed.title,
    description: data.feed.description,
    url,
    id: _.uniqueId('feed_'),
  }
);

const getPosts = (data, feedId) => data.posts
  .map((post) => (
    {
      title: post.title,
      description: post.description,
      link: post.link,
      feedId,
      id: _.uniqueId('post_'),
    }
  ));

const getFeedUpdates = (state, feedId, updatedPosts) => {
  const newPosts = updatedPosts
    .filter(({ title: title1 }) => !state.data.posts
      .some(({ title: title2 }) => title2 === title1));
  newPosts.forEach((post) => (
    { ...post, id: _.uniqueId('post_'), feedId }
  ));
  return newPosts;
};

export { getFeed, getPosts, getFeedUpdates };
