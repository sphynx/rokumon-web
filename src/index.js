import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props) {
  const kind = props.kind;
  const kindClass = kind === 'j' ? 'jade' : (kind === 'g' ? 'gold' : 'card');
  const selectedClass = props.selected ? 'selected-card' : '';
  return (
    <div
      className={`card ${kindClass} ${selectedClass}`}
      onClick={props.onClick}>
      {props.ix}
    </div>
  )
}

function Die(props) {
  const die_char = "⚀⚁⚂⚃⚄⚅"[props.value - 1];
  const selected_clz = props.selected ? 'selected-die' : '';
  return (
    <span
      className={`die ${props.color + '-die'} ${selected_clz}`}
      onClick={props.onClick}>
      {die_char}
    </span>
  )
}

function DiceStock(props) {
  return (
    <div className="dice-stock">
      {props.dice.map((d, ix) =>
        <Die
          key={ix}
          color={d.color}
          value={d.value}
          selected={d === props.selectedDie}
          onClick={() => props.onClick(d)}
        />
      )}
    </div>
  )
}

class Board extends React.Component {
  renderCard(ix) {
    const card = this.props.deck[ix];
    return (<Card
      ix={ix}
      kind={card.kind}
      dice={card.dice}
      selected={ix === this.props.selectedCard}
      onClick={() => this.props.onClick(ix)}
    />);
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

function History(props) {
  return (
    <div>
      History:
      <ol>
        {props.moves.map((move, ix) =>
          <li>Move {ix}: {ppMove(move)}</li>
        )}
      </ol>
    </div>
  );
}

function GameInfo(props) {
  const status = "The game is about to start";
  const sel_die = props.selectedDie;
  const selected_die_info = sel_die ? sel_die.color + sel_die.value : 'None';

  return (
    <div className="game-info">
      <div>Status: {status}</div>
      <div>To move: {props.whoMoves}</div>
      <div>Selected card: {props.selectedCardInfo}</div>
      <div>Selected die: {selected_die_info}</div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    const deck_spec = "jjjgggg";
    let deck = [];
    for (const c of deck_spec) {
      deck.push({ kind: c, dice: [] });
    }
    shuffle(deck);

    this.state = {
      board: {
        layout: 'Brick7',
        deck: deck
      },
      selected_card: null,
      selected_die: null,
      player1_moves: true,
      player1: {
        name: 'Player1',
        dice: [
          { color: 'red', value: 2 },
          { color: 'red', value: 2 },
          { color: 'red', value: 4 },
          { color: 'red', value: 6 },
        ]
      },
      player2: {
        name: 'Player2',
        dice: [
          { color: 'black', value: 1 },
          { color: 'black', value: 1 },
          { color: 'black', value: 3 },
          { color: 'black', value: 5 },
          { color: 'white', value: 1 },
        ],
      },
      history: [],
    }
  }

  handleDieClick(die) {
    this.setState({ selected_die: die, selected_card: null });
  }

  handleCardClick(card_ix) {
    if (this.state.selected_card === card_ix) {
      // Deselect previously selected card.
      this.setState({ selected_card: null });
    } else if (this.state.selected_die !== null) {
      // Place selected die on this card.
      const move = { kind: 'place', what: this.state.selected_die, where: card_ix };
      const history = this.state.history.concat([move]);
      this.applyMove(move);
      this.setState({ selected_die: null, history: history });
    } else if (this.state.selected_card !== null) {
      // Move a die from previously selected card to this one.
      const move = { kind: 'move', from: this.state.selected_card, to: card_ix };
      const history = this.state.history.concat([move]);
      this.applyMove(move);
      this.setState({ selected_die: null, selected_card: null, history: history });
    } else {
      // Select first card.
      this.setState({ selected_die: null, selected_card: card_ix });
    }
  }

  applyMove(move) {
    switch (move.kind) {
      case 'place':
        const card_ix = move.where;
        const die = move.what;

        if (this.state.player1_moves) {
          const dice = this.state.player1.dice;

          let new_dice = [];
          let found = false;

          for (const d of dice) {
            if (d === die && !found) {
              found = true;
            } else {
              new_dice.push({ ...d });
            }
          }

          this.setState({ player1: { name: this.state.player1.name, dice: new_dice } });
        }

        // TODO:
        // put the die on card
        // change who's turn it is

        break;

      default:
        break;

    }
  }

  render() {
    const who_moves = this.state.player1_moves ? this.state.player1.name : this.state.player2.name;
    const sel_card_ix = this.state.selected_card;
    const selected_card_info = sel_card_ix
      ? this.state.board.deck[sel_card_ix].kind
      : 'None';
    return (
      <div className="game">
        <DiceStock
          dice={this.state.player2.dice}
          selectedDie={this.state.selected_die}
          onClick={(die) => this.handleDieClick(die)}
        />
        <Board
          deck={this.state.board.deck}
          layout={this.state.board.layout}
          selectedCard={this.state.selected_card}
          onClick={(card) => this.handleCardClick(card)}
        />
        <DiceStock
          dice={this.state.player1.dice}
          selectedDie={this.state.selected_die}
          onClick={(die) => this.handleDieClick(die)}
        />
        <GameInfo
          whoMoves={who_moves}
          selectedCardInfo={selected_card_info}
          selectedDie={this.state.selected_die}
        />
        <History moves={this.state.history} />
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

function ppMove(move) {
  switch (move.kind) {
    case 'place':
      return 'place ' + ppDie(move.what) + ' at card ' + move.where;
    case 'move':
      return 'move from card ' + move.from + ' to card ' + move.to;
    default:
      return 'unknown move';
  }
}

function ppDie(die) {
  return die.color + die.value;
}