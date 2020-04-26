import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
  render() {
    const kind = this.props.kind;
    const cls = kind === 'j' ? 'jade' : (kind === 'g' ? 'gold' : 'card');
    return (
      <div className={`card ${cls}`}>
        {this.props.ix}
      </div>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);

    const cards_spec = "jjjgggg";
    let cards = [];
    for (const c of cards_spec) {
      cards.push(c);
    }

    shuffle(cards);

    this.state = {
      deck: cards,
    }
  }

  renderCard(i) {
    return <Card ix={i} kind={this.state.deck[i]}/>;
  }

  render() {
    const status = 'Game is about to start';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="top-row">
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
        </div>
        <div className="bottom-row">
          {this.renderCard(3)}
          {this.renderCard(4)}
          {this.renderCard(5)}
          {this.renderCard(6)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}