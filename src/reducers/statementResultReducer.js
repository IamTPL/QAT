import * as actionTypes from '../constants/statementResultConstant';

const initialState = {
    tables: [],
    activeKey: '0',
    isSaving: false,
};

const statementResultReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TABLES:
            return { ...state, tables: action.payload, activeKey: '0' };
        case actionTypes.UPDATE_TABLE:
            return {
                ...state,
                tables: state.tables.map((table, index) =>
                    index === action.payload.index
                        ? { ...table, ...action.payload.data }
                        : table
                ),
            };
        case actionTypes.REMOVE_TABLE:
            return {
                ...state,
                tables: action.payload.tables,
                activeKey: action.payload.newActiveKey,
            };
        case actionTypes.SET_ACTIVE_KEY:
            return { ...state, activeKey: action.payload };
        case actionTypes.SET_IS_SAVING:
            return { ...state, isSaving: action.payload };
        case actionTypes.RESET_STATE: // Reset to initial state
            return initialState;
        default:
            return state;
    }
};

export { statementResultReducer, initialState };
