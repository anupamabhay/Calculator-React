import { ACTIONS } from "./App";

export default function OperatorButton({dispatch, operator}){
    return (
        <button 
        onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operator}})} >
            {operator}
        </button>
    );
}