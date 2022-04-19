import React from 'react'

export function formatDataForReact(samples, schema, visible_cols, default_table){
	const columns = []
	const data = []

	if (visible_cols == null) {
		const cols_dups = []
		samples.forEach(sample => {
			cols_dups.push(sample.column)
		})

		const cols = [...new Set(cols_dups)]
		// get table columns
		get_table_cols(cols, schema, columns)
		// get table data
		populate_default_table(samples, columns, data)

	} else if(visible_cols.length) {

		// get react table's visible columns
		const cols = [...new Set(visible_cols.map(c => c.column))]
		get_table_cols(cols, schema, columns)

		// get default table's visible data
		const visible_cols_ar = [...new Set(visible_cols.map(c => c.column))]
		const default_table_cols = visible_cols.filter(c => c.table_name === default_table)
		const default_table_cols_ar = [...new Set(default_table_cols.map(c => c.column))]
		const default_table_samples = samples.filter(s => s.table_name === default_table && visible_cols_ar.includes(s.column))
		populate_default_table(default_table_samples, default_table_cols, data)

		// get other table's visible data
		console.log(visible_cols)
		const visible_tables_ar = [...new Set(visible_cols.map(c => c.table_name))].filter(t => t !== default_table)
		if (visible_tables_ar.length && visible_tables_ar[0] !== undefined) {
			visible_tables_ar.forEach( vis_tab => {
				const table_cols = schema.filter( c=> c.table_name === vis_tab)
				const required_cols = table_cols.filter(c => (visible_cols_ar.includes(c.column) || c.is_foreign || c.is_primary))
				const required_cols_ar = [...new Set(required_cols.map(c => c.column))]
				const visible_t_cols = table_cols.filter(c => (visible_cols_ar.includes(c.column) && !default_table_cols_ar.includes(c.column)))
				const visible_t_cols_ar = [...new Set(visible_t_cols.map(c => c.column))]
				const table_samples = samples.filter(s => s.table_name === vis_tab && required_cols_ar.includes(s.column))
				const table_data = []
				populate_default_table(table_samples, required_cols, table_data)
				const connection_key = Object.keys(data[0]).filter(k => k in table_data[0])
				data.forEach(d => {
					const connection_val = d[connection_key]
					visible_t_cols_ar.forEach( v => {
						const row = table_data.filter(td => td[connection_key] === connection_val)
						if (row.length && row.length === 1) d[v] = row[0][v]
						else if(row.length && row.length > 1){
							d[v] = row[0][v]
							for(let i = 1; i < row.length; i++){
								const d_more = JSON.parse(JSON.stringify(d))
								d_more[v] = row[i][v]
								data.push(d_more)
							}
						} 
						else d[v] = ''
					})
				})
			})
		}
	}
	return [columns, data]
}

export function get_table_cols(cols, schema, columns){
	cols.forEach(col => {
		const cols = schema.filter(s =>s.column === col)
		let is_float = false
		if (cols.length) is_float = cols[0].type !== 'STR'
		const default_col = {
			'Header': col,
			'accessor': col,
			filter: is_float ? 'between' : 'fuzzyText',
		}
		if (is_float) default_col.Filter = NumberRangeColumnFilter
		columns.push(default_col)
	})
}

function populate_default_table(samples, columns, data){
	let count = 0
	const sample_count = samples.length / columns.length
	for (let i = 0; i < sample_count; i++){
		const sample = {}
		for (let j = 0; j < columns.length; j++){
			count = (i * columns.length) + j
			sample[samples[count].column] = samples[count].value
		}
		data.push(sample)
	}
}

export function formatColumnsForReact(schema, samples){
	const columns = []
	const tables_dups = schema.map(column => column.table_name)
	const uniq_cols = [...new Set(samples.map(c => c.column))]
	const tables = [...new Set(tables_dups)]

	tables.forEach(table => {
		const tab = { table_name: table, columns:[]}
		const cols = schema.filter(col => col.table_name === table)
		cols.forEach(col => {
			if (uniq_cols.includes(col.column)) col['is_visible'] = true
			tab.columns.push(col)
		})
		columns.push(tab)
	})
	return columns
}

 // This is a custom UI for our 'between' or number range
  // filter. It uses two number boxes and filters rows to
  // ones that have values between the two
  function NumberRangeColumnFilter({
	column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
	const [min, max] = React.useMemo(() => {
	  let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	  let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	  preFilteredRows.forEach(row => {
		min = Math.min(row.values[id], min)
		max = Math.max(row.values[id], max)
	  })
	  return [min, max]
	}, [id, preFilteredRows])
  
	return (
	  <div
		style={{
		  display: 'flex',
		}}
	  >
		<input
		  value={filterValue[0] || ''}
		  type="number"
		  onChange={e => {
			const val = e.target.value
			setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
		  }}
		  placeholder={`Min (${min})`}
		  style={{
			width: '70px',
			marginRight: '0.5rem',
		  }}
		/>
		to
		<input
		  value={filterValue[1] || ''}
		  type="number"
		  onChange={e => {
			const val = e.target.value
			setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
		  }}
		  placeholder={`Max (${max})`}
		  style={{
			width: '70px',
			marginLeft: '0.5rem',
		  }}
		/>
	  </div>
	)
}