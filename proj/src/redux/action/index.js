/*
 * action 类型
 */

export const type = {
    SWITCH_MENU : 'SWITCH_MENU',
    SET_CLUSTER_DETAIL:'SET_CLUSTER_DETAIL'
}

// 菜单点击切换，修改面包屑名称
export function switchMenu(menuName) {
    return {
        type:type.SWITCH_MENU,
        menuName
    }
}

export function setClusterDetail(clusterdetaildata) {
    return {
        type:type.SET_CLUSTER_DETAIL,
        clusterdetaildata
    }
}

 