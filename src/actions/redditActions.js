import fetch from 'isomorphic-fetch';

import { SELECT_REDDIT, INVALIDATE_REDDIT, REQUEST_POSTS, RECEIVE_POSTS } from '../constants/ActionTypes';

export function selectReddit(reddit) {
  console.log('select reddit ' + reddit);
  return {
    type: SELECT_REDDIT,
    reddit
  };
}

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  };
}

export function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  };
}

export function receivePosts(reddit, json) {
  console.log('receivePosts ' + reddit);
  return {
    type: RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export function fetchPosts(reddit) {
  return function (dispatch) {
    dispatch(requestPosts(reddit));
console.log('fetching posts');
console.log(reddit);
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)));
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit));
    }
  }
}
