export function getGoods(payload) {
  return { type: 'GOODS/GETGOODS', payload }
}

export function addGoods(payload) {
  return { type: 'GOODS/ADDGOODS', payload }
}

export function updateGoods(payload) {
  return { type: 'GOODS/UPDATEGOODS', payload }
}

export function deleteGoods(payload) {
  return { type: 'GOODS/DELETEGOODS', payload }
}