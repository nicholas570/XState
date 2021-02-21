import { Machine, assign } from 'xstate';

const invokeFecthSubReddit = (context) => {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`).then((res) =>
    res.json().then((json) => json.data.children.map((child) => child.data)),
  );
};

const redditMachine = Machine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
    posts: null,
  },
  states: {
    idle: {},
    selected: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'fetch subreddit',
            src: invokeFecthSubReddit,
            onDone: {
              target: 'loaded',
              actions: assign({
                posts: (context, event) => event.data,
              }),
            },
            onError: 'failed',
          },
        },
        loaded: {},
        failed: {},
      },
    },
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (context, event) => event.name,
      }),
    },
  },
});

export default redditMachine;
