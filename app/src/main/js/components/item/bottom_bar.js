import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ITEM } from '../../consts/types';

class BottomBar extends Component {
  constructor() {
    super();
    this.state = {
      isUpvoted: 0,
      score: 0,
    };
  }
  componentWillMount() {
    const { score, isUpvoted, isUser } = this.props;
    let nextIsUpvoted = isUpvoted;
    if (isUser) {
      nextIsUpvoted = 0;
    }
    this.setState({ isUpvoted: nextIsUpvoted, score, staticScore: score });
  }
  vote(state) {
    if (this.props.isUser) {
      return;
    }
    let voteState = state;
    let nextScore = this.state.score;
    if (this.state.isUpvoted === state) {
      voteState = 0;
      /**
       * Why? Why? Why do it like this?
       * React state updates fast and messes up the calculation
       * if I do nextScore -= this.state.isUpvoted
       */
      if (this.state.isUpvoted === -1) {
        nextScore += 1;
      } else {
        nextScore -= 1;
      }
    } else {
      nextScore += state;
    }
    const { vote, id, type } = this.props;
    if (type) {
      vote(voteState, id, type);
    } else {
      vote(voteState, id);
    }
    this.setState({ isUpvoted: voteState, score: nextScore });
  }
  render() {
    const { comments, type } = this.props;
    const disabled = this.props.isUser ? 'disabled' : '';
    const upvoted = this.props.isUser ? 'disabled' : '';
    return (
      <div className="bottom_bar_container" >
        <div
          className={`upvote ${disabled} ${this.state.isUpvoted > 0 ? 'upvoted' : ''}`}
          disabled={disabled}
          onClick={() => this.vote(1)}
        >
          <span className="ud_icon">+</span>
          <span className="ud_icon">+</span>
        </div>
        <div className="score" >
          <span>{ this.state.score }</span>
        </div>
        <div
          onClick={() => this.vote(-1)}
          disabled={disabled}
          className={`downvote ${disabled} ${this.state.isUpvoted < 0 ? 'downvoted' : ''}`}
        >
          <span className="ud_icon">-</span>
          <span className="ud_icon">-</span>
        </div>
        <div className="padding" />
        {
          type === ITEM.COMMENT.NAME ? null :
          <div className="comments" >
            <i className="ion-chatbubbles" />
            <span>{ comments }</span>
          </div>
        }
      </div>
    );
  }
}


BottomBar.propTypes = {
  score: PropTypes.number.isRequired,
  isUser: PropTypes.bool.isRequired,
  vote: PropTypes.func.isRequired,
  comments: PropTypes.number, //eslint-disable-line
  isUpvoted: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  type: PropTypes.string, //eslint-disable-line
};

export default BottomBar;
