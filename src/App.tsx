import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  // updated to include conditional to be able to only render graph when user chooses 'Start Streaming'
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      // updated to include conditional to be able to only render graph when user chooses 'Start Streaming'
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  // updated to add conditional to only render if showGraph is true
  // this should correspond to user button click of 'Start Streaming'
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  // updating to have this occur continuously, once the button is clicked
  // setting the interval to 200, which is 200 ms.  this means that the function will retrieve
  // data from server 5 times per second.  this can be updated to be more often if it is not continuous enough
  getDataFromServer() {
    // set the interval id so that the interval can be cleared, in order to stop the retrieval
    // also have an interval counter so that the retrieval is not infinite
    let intervalCount = 0;
    // this is time in minutes
    // these are variables for readability and in order to easily update 
    let maxTime = 1;
    // this is the number of ms of an interval
    let intervalDuration = 200;
    let intPerSec = 1000/intervalDuration;

    const intervalID = setInterval(() =>
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ 
          data: [...this.state.data, ...serverResponds],
          showGraph: true,
        });
        intervalCount++;
        console.log(`intervalCount: ${intervalCount}`)
        // this is setting the max duration of the iterations without reset to 5 minutes
        // This is 5 minutes times 60 seconds/minute * 5 intervals/second 
        console.log(`maxtime: ${maxTime}, intPerSec: ${intPerSec}, intervalDuration: ${intervalDuration}`)
        console.log(maxTime*60*intPerSec)
        if (intervalCount > (maxTime*60*intPerSec)) {
          console.log('in if')
          clearInterval(intervalID);
        }
      }), 200);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => { this.getDataFromServer() }}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
