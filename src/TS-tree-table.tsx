import * as React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Checkbox, Table} from 'antd'


interface Data{
    title:string,
    key:string,
    children?:Data[]
}

interface IProps extends React.Props<any>{
    data:Data[],
    onChange:any,
    columnWidthArray:string[]|number[],
    checkedKeys:string[],
    editAble?:boolean
}

interface Istate{
    dataSource: any[],
    columns: any[],
}

let keyMap:any={}


const encodeData = (data:any, i:number = 0, addData:any = {}) => {
    let ret:any[] = []
    data.map((item:any) => {
        keyMap[item.key]=item.title
        let next = Object.assign({[i]: item.key}, addData)
        if (item.children&&item.children.length>0) {
            ret.push(...encodeData(item.children, i + 1, next))
        } else {
            ret.push(next)
        }
    })
    return ret
}


const getMaxDepth = (data:any):number => {
    let max = 1
    data.map((item:any) => {
        if (item.children&&item.children.length) {
            let childDepth = getMaxDepth(item.children)
            if (max < 1 + childDepth)
                max = 1 + childDepth
        }
    })
    return max
}


const getChildrenMap = (data:any) => {
    let ret = {}
    data.map((item:any) => {
        if(item.children&&item.children.length){
            ret[item.key] = []
            let childrenMap = getChildrenMap(item.children)
            item.children.map((subItem:any) => {
                if(childrenMap[subItem.key]){
                    ret[item.key].push(...childrenMap[subItem.key])
                } else {
                    ret[item.key].push(subItem.key)
                }
            })
            ret = Object.assign(ret, childrenMap)
        }
    })
    return ret
}


const hasInArray = (subArray:any[], array:any[]):any => {
    for(let i in subArray) {
        if (array.indexOf(subArray[i]) >= 0)
            return true
    }
}


const hasNotInArray = (subArray:any[], array:any[]):any => {
    for(let i in subArray) {
        if (array.indexOf(subArray[i]) < 0)
            return true
    }
}

export default  class TS_tree_table extends React.Component<IProps,Istate> {
    childrenKeyMap:any=[]
    maxDepth:number=0
    constructor(props:IProps){
        super(props)
        this.state = {
            dataSource: [],
            columns: [],
        }
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate
    }


    generateData = (props?:any) => {
        let {data,columnWidthArray} = props

        const dataSource = encodeData(data)

        const max = getMaxDepth(data)

        this.maxDepth=max

        this.childrenKeyMap = getChildrenMap(data)
        let columns = [],
            level=['一级','二级','三级','四级','五级']
        for (let i = 0; i < max; i++) {
            columns.push({
                key: i,
                dataIndex: i,
                title: level[i],
                width: columnWidthArray[i],
                render: (t:any, r:any, rowIndex:number) => {
                    const obj = {
                        children: t ? this.getCheckBox(t) : "",
                        props: {colSpan:1,rowSpan:1}
                    }

                    //行合并
                    if (dataSource[rowIndex - 1] && dataSource[rowIndex - 1][i] === dataSource[rowIndex][i]) {
                        obj.props.rowSpan = 0
                    } else {
                        let rowSpan = 1
                        for (let j = 1; dataSource[rowIndex + j] && dataSource[rowIndex + j][i] === dataSource[rowIndex][i]; j++) {
                            rowSpan++
                        }
                        obj.props.rowSpan = rowSpan
                    }
                    return obj
                }
            })
        }
        this.setState({dataSource, columns})
    }


    getCheckBox = (t:any) => {
        let {checkedKeys} = this.props
        const hasSeleted = hasInArray(this.childrenKeyMap[t], checkedKeys)
        const hasUnSeleted = hasNotInArray(this.childrenKeyMap[t], checkedKeys)
        return (
            keyMap[t]?<Checkbox
                checked={this.childrenKeyMap[t] ? hasSeleted && !hasUnSeleted : checkedKeys.indexOf(t) >= 0}
                indeterminate={this.childrenKeyMap[t] ? hasSeleted && hasUnSeleted : false}
                onChange={e => {
                    const   disabled=typeof this.props.editAble==='boolean'?!this.props.editAble:true
                    if(disabled){return}
                    if (e.target.checked) {
                        if(this.childrenKeyMap[t]){
                              checkedKeys.push(t)
                            this.childrenKeyMap[t].map((item:any) => {
                                if(checkedKeys.indexOf(item) < 0){
                                    checkedKeys.push(item)
                                }
                            })
                        } else {
                            checkedKeys.push(t)
                        }
                    } else {

                        if(this.childrenKeyMap[t]){
                            checkedKeys.splice(checkedKeys.indexOf(t), 1)
                            this.childrenKeyMap[t].map((item:any) => {
                                if(checkedKeys.indexOf(item) >= 0){
                                    checkedKeys.splice(checkedKeys.indexOf(item), 1)
                                }
                            })
                        } else {
                            checkedKeys.splice(checkedKeys.indexOf(t), 1)
                        }
                    }

                    this.props.onChange(checkedKeys)
                }}
            >{keyMap[t]}</Checkbox>:''
        )
    }

    componentWillMount() {
        this.generateData(this.props)
    }


    componentWillReceiveProps(next:any){
        if(next.data!==this.props.data){
            this.generateData(next)
        }
        this.setState(next)
    }

    render() {
        let {dataSource, columns} = this.state
        dataSource.map((d)=>{
            for(let i=0;i<=this.maxDepth;i++){
                if(!d[i]){
                    d[i]=Symbol('空')
                }
            }
        })
        return (
            <Table
                pagination={false}
                rowKey={(e)=>e[1]}
                showHeader
                columns={columns}
                dataSource={dataSource}
            />
        )
    }
}

