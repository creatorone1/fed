import React from 'react';
import { Select } from 'antd'
const Option = Select.Option;
export default {
    urlprefix:'http://localhost:9090',
    //urlprefix:'http://10.103.240.130:9090',
    //urlprefix:'http://2w7750p724.wicp.vip:55039',
    //urlprefix:'http://103.46.128.49:55039',
    nodedetail:undefined, 
     clusterdetail:undefined, 
    formateDate(time){
        if(!time)return '';
        let date = new Date(time);
        function formatDate(date) {
            var year = date.getFullYear()
            var month = format(date.getMonth() + 1)
            var da = format(date.getDate())
            var h = format(date.getHours())
            var m = format(date.getMinutes())
            var s = format(date.getSeconds())
            return year + '-' + month + '-' + da + ' ' + h + ':' + m + ':' + s
          }
          function format(val) {
            return Number(val) < 10 ? '0' + val : '' + val
          }
        return formatDate(date);
    },
    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.result.page,      //当前第几页
            pageSize:data.result.page_size, //当前大小
            total: data.result.total_count, //每页数值
            showTotal:()=>{
                return `共${data.result.total_count}条`
            },
            showQuickJumper:true
        }
    },
    // 格式化金额,单位:分(eg:430分=4.30元)
    formatFee(fee, suffix = '') {
        if (!fee) {
            return 0;
        }
        return Number(fee).toFixed(2) + suffix;
    },
    // 格式化公里（eg:3000 = 3公里）
    formatMileage(mileage, text) {
        if (!mileage) {
            return 0;
        }
        if (mileage >= 1000) {
            text = text || " km";
            return Math.floor(mileage / 100) / 10 + text;
        } else {
            text = text || " m";
            return mileage + text;
        }
    },
    // 隐藏手机号中间4位
    formatPhone(phone) {
        phone += '';
        return phone.replace(/(\d{3})\d*(\d{4})/g, '$1***$2')
    },
    // 隐藏身份证号中11位
    formatIdentity(number) {
        number += '';
        return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2')
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },
    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },
}