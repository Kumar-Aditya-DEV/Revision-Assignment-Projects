import React, { useReducer } from 'react';

const initialState = {
  count: 0,
  name: '',
  rank: 0, // Changed to lowercase 'rank' for standard naming
};

function reducer(state, action) {
  switch (action.type) {
    case "handleInc":
      console.log("Handle Inc function called....");
      return { ...state, count: state.count + 1 };

    case "handleDec":
      console.log("Handle Dec function called....");
      return { ...state, count: state.count - 1 };

    case "handleName":
      console.log("Handle Name function called....");
      // If you want to update the Rank AND the Name at the same time:
      return { 
        ...state, 
        name: "Aditya Kumar Patel", 
        rank: 100 
      };

    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
}




export default function App(){
  const[state, dispatch] = useReducer(reducer, initialState);

return (
  <div className="container">
    <div className="card">
      <div className="state-info">
        <p><strong>Count:</strong> <span>{state.count}</span></p>
        <p><strong>Name:</strong> <span>{state.name || '---'}</span></p>
        <p><strong>Rank:</strong> <span>{state.rank}</span></p>
      </div>
      
      <div className="button-group">
        <button onClick={() => dispatch({ type: "handleInc" })}>Increment</button>
        <button onClick={() => dispatch({ type: "handleDec" })}>Decrement</button>
        <button onClick={() => dispatch({ type: "handleName" })}>Set Name</button>
        <button onClick={() => dispatch({ type: "handleRank" })}>Set Rank</button>
      </div>
    </div>
  </div>
);
}