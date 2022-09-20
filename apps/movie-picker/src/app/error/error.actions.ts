import {createAction, props} from '@ngrx/store';

export const showErrorMessage = createAction('[Error Component] Show Message', props<{message: string}>());
export const removeErrorMessage = createAction('[Error Component] Remove Message', props<{index: number}>())
