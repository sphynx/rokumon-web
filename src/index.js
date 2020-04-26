import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props) {
  const kind = props.kind;
  const kindClass = kind === 'j' ? 'jade' : (kind === 'g' ? 'gold' : 'card');
  return (
    <div className={`card ${kindClass}`}>
      {props.ix}
    </div>
  )
}

function Die(props) {
  const die_char = "⚀⚁⚂⚃⚄⚅"[props.value - 1];
  return (
    <span className={`die ${props.color + '-die'}`}>
      {die_char}
    </span>
  )
}

function DiceStock(props) {
  return (
    <div className="dice-stock">
      {props.dice.map((d, ix) =>
        <Die key={ix} color={d.color} value={d.value} />
      )}
    </div>
  )
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
    return <Card ix={i} kind={this.state.deck[i]} />;
  }

  render() {
    return (
      <div>
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
  constructor(props) {
    super(props);
    this.state = {
      player1_dice: [
        { color: 'red', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 4 },
        { color: 'red', value: 6 },
      ],
      player2_dice: [
        { color: 'black', value: 1 },
        { color: 'black', value: 1 },
        { color: 'black', value: 3 },
        { color: 'black', value: 5 },
        { color: 'white', value: 1 },
      ]
    }
  }

  render() {
    return (
      <div className="game">
        <DiceStock dice={this.state.player1_dice} />
        <div className="game-board">
          <Board />
        </div>
        <DiceStock dice={this.state.player2_dice} />
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