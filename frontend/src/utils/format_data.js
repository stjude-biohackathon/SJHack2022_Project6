export function formatDataForReact(samples){
	const cols_dups = []
	samples.forEach(sample => {
	  cols_dups.push(sample.column)
	})

  const cols = [...new Set(cols_dups)]
  const columns = []
  
  cols.forEach(col => {
	  columns.push(
		  {
			  'Header': col,
			  'accessor': col
		  }
	  )
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