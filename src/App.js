import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperatorButton from './OperatorButton';
import './style.css';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DEL_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currOperand === "0") return state
      if(payload.digit === "." && state.currOperand == null) return state
      if(payload.digit === "." && state.currOperand.includes(".")) return state
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}` 
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currOperand == null && state.prevOperand == null) return state;
      if(state.prevOperand == null){
        return{
          ...state,
          operation: payload.operator,
          prevOperand: state.currOperand,
          currOperand: null
        }
      }
      if(state.currOperand == null){
        return {
          ...state,
          operation: payload.operator
        }
      }
      return {
          ...state,
          prevOperand: evaluate(state),
          operation: payload.operator,
          currOperand: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currOperand == null || state.prevOperand == null) return state;
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currOperand: evaluate(state)
      }

    case ACTIONS.DEL_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: null
        }
      }
      if(state.currOperand == null) {
        return state
      }
      if(state.currOperand.length === 1) {
        return {
          ...state, 
          currOperand: null
        }
      }
      return{
        ...state,
        currOperand: state.currOperand.slice(0, -1)
      }
  }
}

function evaluate({currOperand, prevOperand, operation}){
  const curr = parseFloat(currOperand);
  const prev = parseFloat(prevOperand);
  if(isNaN(curr) || isNaN(prev)) return "";
  let result = "";
  switch(operation){
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;    
  }
  return result.toString();
}

function App() {
  const [{prevOperand, currOperand, operation}, dispatch] = useReducer(reducer, {});

  return(
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">{prevOperand} {operation}</div>
        <div className="curr-operand">{currOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type:ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
      <OperatorButton dispatch={dispatch} operator="/" />

      
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperatorButton dispatch={dispatch} operator="*" />
  
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperatorButton dispatch={dispatch} operator="-" />
  
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperatorButton dispatch={dispatch} operator="+" />

      <DigitButton dispatch={dispatch} digit="0" />
      <DigitButton dispatch={dispatch} digit="." />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>

    </div>
  )
}

export default App;
