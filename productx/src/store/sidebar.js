const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
};

export const sidebarReducer = (state = initialState, { type, ...rest }) => {
  console.log(state);
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarShow: !state.sidebarShow };
    case 'TOGGLE_UNFOLDABLE':
      return { ...state, sidebarUnfoldable: !state.sidebarUnfoldable };
    default:
      return state;
  }
};
