import React from 'react'

export function formatDataForReact(samples, schema){
	const cols_dups = []
	samples.forEach(sample => {
	  cols_dups.push(sample.column)
	})

  const cols = [...new Set(cols_dups)]
  const columns = []
  
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

  // get table data
  const data = []
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
  return [columns, data]
}

export function formatColumnsForReact(schema){
	const columns = []
	const tables_dups = []
	schema.forEach(column => {
	  tables_dups.push(column.table_name)
	})
	const tables = [...new Set(tables_dups)]

	tables.forEach(table => {
		const tab = { table_name: table, columns:[]}
		const cols = schema.filter(col => col.table_name === table)
		cols.forEach(col => {
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