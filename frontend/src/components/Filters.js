import React from 'react'
import { useState } from 'react'
import { formatColumnsForReact } from '../utils/format_table_data'

const Filters = (props) => {
	let { samples, schema, columns, parentCallback } = props
	if (!samples || !samples.length) samples = []
	if (!schema || !schema.length) schema = []
	const tables = formatColumnsForReact(schema, samples)
	const uniq_cols = (columns !== null) ? [...new Set(columns.map(c => c.column))] : [...new Set(samples.map(c => c.column))]
	const checked_cols = uniq_cols.map(c => samples[0].table_name + c)
	const [checked, setChecked] = useState(checked_cols)
	const [state, setState] = useState(columns)
	const changeState = () => {
		setState(visible_cols)
		parentCallback(visible_cols)
	}
	// console.log(samples, columns, checked)

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
			visible: visible 
		})
	})

	// Add/Remove checked item from list
	const handleCheck = (event) => {
		let vis_cols = [...checked]
		if (event.target.checked) {
			vis_cols = [...checked, event.target.value]
		} else {
			vis_cols = vis_cols.splice(checked.indexOf(event.target.value), 1)
			const [table_name, column] = event.target.value.split('+')
			let col = schema.find(t => (t.table_name === table_name && t.column === column))
			if (col) {
				col['visible'] = false
				if(columns) columns = columns.filter( c => c.column !== col.column)
			}
		}
		visible_cols = all_cols.filter(t => t.visible === true)
		// console.log(visible_cols)
		checked.forEach(chk => {
			const [table_name, column] = chk.split('+')
			let col = all_cols.find(t => (t.table_name === table_name && t.column === column))
			if (col) col['visible'] = true
		})
		// console.log(vis_cols, checked)
		setChecked(vis_cols)
	}

	checked.forEach(chk => {
		const [table_name, column] = chk.split('+')
		let col = all_cols.find(t => (t.table_name === table_name && t.column === column))
		if (col) col['visible'] = true
	})

	let visible_cols = all_cols.filter(t => t.visible === true)
	columns = state
	console.log(visible_cols)
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
							<div className='font-bold'>{table.table_name}</div>
							<ul className='column-list grid place-items-start p-1'>
								{table.columns.map(col => {
									const u_key = table.table_name + '+' + col.column
									return (
										<li key={u_key}>
											<div className='toppings-list-item m-0.5'>
												<input
													type='checkbox'
													id={`custom-checkbox-${u_key}`}
													name={u_key}
													value={u_key}
													onChange={handleCheck}
													checked={visible_cols.find(c => (c.column === col.column && c.table_name === table.table_name)) ? true: false}
													// checked={col.is_visible}
												/>
												<label className='pl-2' htmlFor={`custom-checkbox-${u_key}`}>{col.column + (col.is_primary ? ' *' : '') + (col.is_foreign ? ' ~' : '')}</label>
											</div>
										</li>
									)
									})}
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
