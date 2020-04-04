
import * as React from 'react';
import TS_tree_table from './TS-tree-table'
import './style.css'
interface IProps extends React.Props<any>{

}
interface Istate{
	checkedKeys:any[]
}

export default class  APP extends React.Component<IProps,Istate> {
	constructor(props:IProps){
		super(props);
		this.state={
			checkedKeys:[]
		}
	}

	changeList=(checkedKeys:any)=>{
		console.log(checkedKeys)
		this.setState({checkedKeys})
	}

	public render() {
		let data=[
			{title:'一级权限',key:'0',children:[
					{title:'二级权限',key:'01',children:[
							{title:'三级权限',key:'011'},
							{title:'三级权限',key:'012'}
						]},
					{title:'二级权限',key:'03',children:[]},
				]},
			{title:'一级权限',key:'1',children:[
				    {title:'二级权限',key:'11',children:[]},
					{title:'二级权限',key:'12',children:[
							{title:'三级权限',key:'0113'},
							{title:'三级权限',key:'0125'},
							{title:'三级权限',key:'0114'},
						]},
				]},
			{title:'一级权限',key:'2',children:[
				{title:'二级权限',key:'21',children:[
						{title:'二级权限',key:'211',children:[]},
						{title:'二级权限',key:'212',children:[]},
					]}
				]},
			{title:'一级权限',key:'3',children:[
				    {title:'二级权限',key:'31',children:[
							{title:'三级权限',key:'311'},
							{title:'三级权限',key:'312'},
							{title:'三级权限',key:'313'},
						]},
					{title:'二级权限',key:'34',children:[]},
				]},
			]
		return (
			<div className="APP">
<TS_tree_table
	data={data}
	onChange={this.changeList}
	columnWidthArray={["auto","auto","auto","auto","auto"]}
	checkedKeys={this.state.checkedKeys}
	editAble={true}
/>
			</div>
		)
	}
}