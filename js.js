//React:
const UPDATE_QUOTE = "UPDATE_QUOTE";
const SET_QUOTES = "SET_QUOTES";
const SET_ERROR = "SET_ERROR";

const defaultState = {
  error: null,
  isLoaded: false,
  colors: [
    "#5aa9c2",
    "#b6d3ef",
    "#0099bd",
    "#0098db",
    "#50afe4",
    "#131862",
    "#88c4ec",
    "#91afd9",
    "#88cad2",
    "#2e4482",
    "#546bab",
    "#87889c",
    "#bea9de",
  ],
  quotes: [],
  currentQuote: {},
};

const updateQuote = (quote) => {
  return {
    type: UPDATE_QUOTE,
    quote: quote,
  };
};

const setQuotes = (quotes) => {
  return {
    type: SET_QUOTES,
    quotes: quotes,
  };
};

const setError = (error) => {
  return {
    type: SET_ERROR,
    error,
  };
};

const quoteReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_QUOTES:
      return {
        ...state,
        isLoaded: true,
        quotes: action.quotes,
      };
    case UPDATE_QUOTE:
      return {
        ...state,
        currentQuote: action.quote,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

const store = Redux.createStore(quoteReducer);

class RandomQuoteMachine extends React.Component {
  constructor(props) {
    super(props);
    this.newQuote = this.newQuote.bind(this);
  }

  componentDidMount() {
    fetch(
      "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.props.setQuotes(result.quotes);
          this.newQuote();
        },
        (error) => {
          this.props.setError(error);
        }
      );
  }

  newQuote() {
    const newQuote =
      this.props.quotes[Math.floor(Math.random() * this.props.quotes.length)];
    this.props.updateQuote(newQuote);
  }

  render() {
    const { error, isLoaded, colors, currentQuote } = this.props;
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (error) {
      return <>Error: {error.message}</>;
    } else if (!isLoaded || currentQuote.quote == undefined) {
      return <div id="loading">Loading...</div>;
    } else {
      return (
        <div id="wrapper" style={{ backgroundColor: color }}>
          <h1>Random Quote Machine</h1>
          <div id="main-content">
            <ReactTransitionGroup.TransitionGroup classNames="quote-box">
              <ReactTransitionGroup.CSSTransition
                in={true}
                appear={true}
                key={currentQuote.quote}
                timeout={1000}
                classNames="fade"
              >
                <div
                  key="{currentQuote.quote}"
                  id="quote-box"
                  class="quote-box"
                >
                  <q id="text">{currentQuote.quote}</q>
                  <div id="author">{currentQuote.author}</div>
                </div>
              </ReactTransitionGroup.CSSTransition>
            </ReactTransitionGroup.TransitionGroup>
          </div>
          <div id="footer">
            <button
              id="new-quote"
              class="btn btn-success"
              onClick={this.newQuote}
            >
              New Quote
            </button>
            <a
              class="btn btn-primary"
              role="button"
              target="_blank"
              href={
                'https://twitter.com/intent/tweet?text="' +
                currentQuote.quote +
                '"%20' +
                currentQuote.author
              }
            >
              <i class="fa fa-twitter"></i> Tweet
            </a>
          </div>
        </div>
      );
    }
  }
}

// React-Redux
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

const mapStateToProps = (state) => {
  return {
    error: state.error,
    isLoaded: state.isLoaded,
    quotes: state.quotes,
    colors: state.colors,
    currentQuote: state.currentQuote,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateQuote: (quote) => {
      dispatch(updateQuote(quote));
    },
    setQuotes: (quotes) => {
      dispatch(setQuotes(quotes));
    },
    setError: (error) => {
      dispatch(setError(error));
    },
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(RandomQuoteMachine);

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

ReactDOM.render(<AppWrapper />, document.getElementById("app"));
