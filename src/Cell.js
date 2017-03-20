var React = require('react');

var Cell = React.createClass({
    handleCellClicked: function () {
        this.props.handleCellClicked(this.props.row, this.props.col, this.props.cellStatus);
    },
    render: function () {
        return (
            <div className={"cell " + this.props.cellStatus} onClick={this.handleCellClicked} />
        )
    }
});

module.exports = Cell;