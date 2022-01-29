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

export { getFeed, getPosts };
