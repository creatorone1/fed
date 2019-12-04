/**
 * reducer
 */

import { combineReducers } from 'redux'
import { type } from '../action';

function clusterdetaildata(state ={},action){
    switch(action.type){
        case 'SET_CLUSTER_DETAIL':
            return action.clusterdetaildata
        default :
            return  state
    }
}
function menuName(state='',action){
    switch (action.type) {
        case type.SWITCH_MENU: 
              return action.menuName 
        default:
            return state;
    }
}
const k8sApp= combineReducers({
    clusterdetaildata,
    menuName
})
/*
const ebikeData = (state, action) => {
    switch (action.type) {
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName:action.menuName
            };
        default:
            return {...state};
    }
};*/

export default k8sApp;
export const getclusterdetaildata = state => state.clusterdetaildata;