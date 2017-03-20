import React, { Component } from 'react';
import './App.css';
Number.prototype.mod = function (n) { return ((this % n) + n) % n; };
var Cell = require('./Cell.js');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Board = React.createClass({

  getInitialState: function () {
    return {
      row: 50,
      col: 50,
      CellGrid: [],
      iteration: 0
    }
  },

  TempGrid: [],
  runner: undefined,

  newBoard: function (flag) {
    clearInterval(this.runner);
    this.TempGrid = [];
    for (var i = 0; i < this.state.row; i++) {
      for (var j = 0; j < this.state.col; j++) {
        this.TempGrid.push(
          <Cell
            key={'r' + i + 'c' + j}
            row={i}
            col={j}
            handleCellClicked={this.handleCellClicked}
            cellStatus={(flag) ? (Math.floor((Math.random() * 10) + 1) < 3 ? "alive" : "dead") : "dead"}
          />
        );
      }
    }
    this.setState({
      CellGrid: this.TempGrid,
      iteration: 0
    });
  },

  componentWillMount: function () {
    this.newBoard(true);
    this.playChance();
  },

  handleCellClicked: function (row, col, cellStatus) {
    this.TempGrid = this.state.CellGrid.slice();
    this.tempBoardUpdate(row, col, cellStatus);
    this.setState({
      CellGrid: this.TempGrid
    });
  },

  tempBoardUpdate: function (row, col, cellStatus) {
    this.TempGrid[row * this.state.row + col] = <Cell key={'r' + row + 'c' + col} row={row} col={col} handleCellClicked={this.handleCellClicked} cellStatus={(cellStatus === "dead") ? "alive" : "dead"} />
  },

  playChanceFunction: function () {
    this.TempGrid = this.state.CellGrid.slice();
    for (var i = 0; i < this.state.CellGrid.length; i++) {
      var aliveNeighbor = this.getAliveNeighborCount(this.state.CellGrid[i].props.row, this.state.CellGrid[i].props.col);
      if (this.state.CellGrid[i].props.cellStatus === "dead") {
        if (aliveNeighbor === 3) {
          this.tempBoardUpdate(this.state.CellGrid[i].props.row, this.state.CellGrid[i].props.col, this.state.CellGrid[i].props.cellStatus);
        }
      } else {
        if (aliveNeighbor < 2 || aliveNeighbor > 3) {
          this.tempBoardUpdate(this.state.CellGrid[i].props.row, this.state.CellGrid[i].props.col, this.state.CellGrid[i].props.cellStatus);
        }
      }
    }
    this.setState({
      CellGrid: this.TempGrid,
      iteration: this.state.iteration + 1
    });
  },

  playChance: function () {
    var self = this;
    this.runner = setInterval(self.playChanceFunction, 500);
  },

  getAliveNeighborCount: function (row, col) {
    var cnt = 0;
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        var newI = i.mod(this.state.row);
        var newJ = j.mod(this.state.col);
        var neighborCellIndex = ((newI * this.state.row) + newJ);
        if ((this.state.CellGrid[neighborCellIndex].props.cellStatus === "alive") & !(newI === row && newJ === col)) {
          cnt++;
        }
      }
    }
    return cnt;
  },

  render: function () {
    return (
      <div style={{ 'width': (this.state.col * 15) + 2 }} className="board text-center">
        {this.state.CellGrid}
        <ButtonToolbar style={{ 'marginTop': '10px' }}>
          <Button bsStyle="primary" onClick={this.playChance}>Play {this.state.iteration}</Button>
          <Button bsStyle="warning" onClick={() => this.newBoard(false)}>Clear</Button>
          <Button bsStyle="danger" onClick={() => this.newBoard(true)}><span className="glyphicon glyphicon-random" />  Randomize</Button>
        </ButtonToolbar>
      </div>
    );
  }
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Game of Life</h2>
        <div className="App-content">
          <Board />
        </div>
      </div>
    );
  }
}

export default App;
