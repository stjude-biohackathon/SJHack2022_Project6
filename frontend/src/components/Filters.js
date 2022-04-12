import React from 'react'
import { useState } from 'react'
import { formatColumnsForReact } from '../utils/format_data'

const Filters = (props) => {
	let { schema } = props
	if (!schema || !schema.length) schema = []
	const tables = formatColumnsForReact(schema)
	// console.log(tables)
	const [checked, setChecked] = useState([])
	let all_cols = []
	schema.forEach(col => 
		all_cols.push({
			table_name: col.table_name,
			column: col.column,
			visible: false
	}))

	// Add/Remove checked item from list
	const handleCheck = (event) => {
		let updatedList = [...checked]
		if (event.target.checked) {
			updatedList = [...checked, event.target.value]
		} else {
			updatedList.splice(checked.indexOf(event.target.value), 1)
		}
		setChecked(updatedList)
	}

	checked.forEach(chk => {
		const [table_name, column] = chk.split('+')
		let col = all_cols.find(t => (t.table_name === table_name && t.column === column))
		if (col) col['visible'] = true
	})

	const visible_cols = all_cols.filter(t => t.visible === true)
	console.log('visible columns', visible_cols)

	return (
		<div className='w-1/5 h-[100vh] bg-gray-200 flex flex-col justify-start'>
			<h2 className='text-xl mt-10'> Filters </h2>
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
												/>
												<label className='pl-2' htmlFor={`custom-checkbox-${u_key}`}>{col.column}</label>
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
			<button className='inline-block font-bold text-sm px-4 py-2 bg-gray-200 hover:bg-red-900 leading-none border border-2 rounded text-white hover:border-white border-transparent text-red-900 hover:text-white border-red-900 mt-4 lg:mt-0'>
				Apply
			</button> 
		</div>
	)
}

export default Filters
