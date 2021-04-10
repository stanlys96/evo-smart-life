const initialState = {
  goods: [],
  currentGoods: {}
}

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'GOODS/GETGOODS':
      return { ...state, goods: payload }
    case 'GOODS/ADDGOODS':
      return { ...state, goods: [...state.goods, payload] }
    case 'GOODS/UPDATEGOODS':
      return { ...state, goods: payload }
    case 'GOODS/DELETEGOODS':
      return { ...state, goods: payload }
    default:
      return state;
  }
}

export default reducer;