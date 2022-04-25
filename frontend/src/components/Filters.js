import React from 'react'
import { useState } from 'react'
import { formatColumnsForReact } from '../utils/format_table_data'
import CheckboxesGroup from './CheckboxesGroup'

const Filters = (props) => {
	let { samples, schema, columns, parentCallback } = props
	if (!samples || !samples.length) samples = []
	if (!schema || !schema.length) schema = []
	const tables = formatColumnsForReact(schema, samples)
	const [state, setState] = useState(columns)
	const changeState = () => {
		setState(visible_cols)
		parentCallback(visible_cols)
	}

	let all_cols = []
	schema.forEach(col => {
		let visible = false
		if (columns === null)
			visible = samples.find(s => (s.column === col.column && s.table_name === col.table_name)) ? true: false
		else
			visible = columns.find(s => (s.column === col.column && s.table_name === col.table_name)) ? true: false
		all_cols.push({
			table_name: col.table_name,
			column: col.column,
			visible: visible,
			is_primary: col.is_primary,
			is_foreign: col.is_foreign 
		})
	})

	// update visible_cols list
	const updateVisCols = (columns) => {
		columns.forEach(col => {
			all_cols.find(c => c.table_name === col.table_name && c.column === col.column).visible = col.visible
		})
		visible_cols = all_cols.filter(c => c.visible === true)
	}

	let visible_cols = all_cols.filter(c => c.visible === true)
	// console.log(visible_cols)
	// console.log('visible columns', columns)
	return (
		<div className='w-1/4 h-max bg-gray-200 flex flex-col justify-start z-10'>
			<aside className='h-screen sticky top-0 overflow-y-scroll scrolling-touch'>
			<h2 className='text-2xl mt-10 mb-5'> Filters </h2>
			<div className='border-t-2 border-red-800 border-opacity-25 items-start pl-10 grid justify-items-start text-left'>
				<p className='text-sm mt-2'> *  Unique ID <br/> ~ Connecting ID</p>
			</div>
			<div className='grid place-items-start p-4'>
			{
				tables.map(table => (
					<div key={table.table_name} className='border-t-2 border-red-800 border-opacity-25 w-full'>
						<div className='justify-self-start p-1'>
							<div className='font-bold'>{
								(table.table_name.includes('00_')) ? table.table_name.split('00_')[1]: table.table_name 
							}</div>
							<ul className='column-list grid place-items-start p-1'>
							<CheckboxesGroup table_name={table.table_name} columns={all_cols.filter(col => col.table_name === table.table_name)} filterCallback={updateVisCols} />
								</ul>
						</div>
					</div>
				))
			}
			
			</div>
			<button 
				className='inline-block font-bold text-sm my-6 px-4 py-2 bg-gray-200 
				hover:bg-red-900 leading-none border border-2 rounded text-white 
				hover:border-white border-transparent text-red-900 hover:text-white border-red-900 mt-4 lg:mt-0'
				type='button'
				onClick={changeState}
			>
				Apply
			</button>
			</aside> 
		</div>
	)
}

export default Filters
