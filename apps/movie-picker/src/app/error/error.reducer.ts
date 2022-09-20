import {createReducer, on} from '@ngrx/store';
import {showErrorMessage, removeErrorMessage} from './error.actions';

export interface IErrorState {
    messages: string[];
}

export const initialState: IErrorState = {
    messages: [],
};

export const errorReducer = createReducer(
    initialState,
    on(showErrorMessage, (state, {message}) => ({...state, messages: [...state.messages, message]})),
    on(removeErrorMessage, (state, {index}) => ({
        ...state,
        messages: state.messages.filter((message, i) => i !== index),
    })),
);
