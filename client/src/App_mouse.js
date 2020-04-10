import React from 'react';
// import './App.css';
import MouseTooltip from './libs/MouseTooltip.js';


class App extends React.Component {
  state = {
    isMouseTooltipVisible: false,
  };

  disableMouseTooltip = () => {
    // the first argument is always going to be the previous state
    this.setState(prevState => ({ isMouseTooltipVisible: false }));
  };

  enableMouseTooltip = () => {
    // the first argument is always going to be the previous state
    this.setState(prevState => ({ isMouseTooltipVisible: true }));
  };

  render() {
    return (
      <div>
        {/* <button onClick={this.toggleMouseTooltip} >
          Toggle mouse tooltip
        </button> */}
        <MouseTooltip
          visible={this.state.isMouseTooltipVisible}
          offsetX={15}
          offsetY={10}
          enableMouseTooltip={this.enableMouseTooltip}
          disableMouseTooltip={this.disableMouseTooltip}
        >
          <form>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </MouseTooltip>
      </div>
    );
  }
}

export default App;
