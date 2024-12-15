import * as actionTypes from '../constants/admManagementConstants';

const initialState = {
    users: [],
    isLoading: false,
    selectedUsers: [],
    selectedItemPerPage: 10,
    searchObject: {
        fullName: '',
        status: [],
    },
    activeSortColumn: false,
    sortState: {
        fullName: null,
        email: null,
        status: null,
        createdAt: null,
        updatedAt: null,
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalPage: 0,
    },
    isCreateUserModalOpen: false,
    isEditUserModalOpen: false,
    isResetEnabled: false,
};

const admManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USERS:
            return { ...state, users: action.payload };
        case actionTypes.SET_SELECTED_USERS:
            return { ...state, selectedUsers: action.payload };
        case actionTypes.SET_SELECTED_ITEM_PER_PAGE:
            return { ...state, selectedItemPerPage: action.payload };
        case actionTypes.UPDATE_PAGINATION:
            return {
                ...state,
                pagination: { ...state.pagination, ...action.payload },
            };
        case actionTypes.UPDATE_SORT_STATE:
            return {
                ...state,
                sortState: { ...initialState.sortState, ...action.payload },
            };
        case actionTypes.SET_ACTIVE_SORT_COLUMN:
            return { ...state, activeSortColumn: action.payload };
        case actionTypes.UPDATE_SEARCH_OBJECT:
            return {
                ...state,
                searchObject: { ...state.searchObject, ...action.payload },
            };
        case actionTypes.SET_IS_MODAL_CREATE_OPEN:
            return { ...state, isCreateUserModalOpen: action.payload };
        case actionTypes.SET_IS_MODAL_EDIT_OPEN:
            return { ...state, isEditUserModalOpen: action.payload };
        case actionTypes.SET_IS_LOADING:
            return { ...state, isLoading: action.payload };
        case actionTypes.SET_IS_RESET_ENABLED:
            return { ...state, isResetEnabled: action.payload };
        default:
            return state;
    }
};

export { admManagementReducer, initialState };
