import React from 'react'
import { useTable } from 'react-table'

const Table = (props) => {
	let { samples } = props;
	if (!samples || !samples.length) samples = []
	const data = []
	let  columns = []

	// if (!samples || samples.length === 0) return <p>No repos, sorry</p>;

	// get column names
	const cols_dups = []
  	samples.forEach(sample => {
		cols_dups.push(sample.column)
  	})

	const cols = [...new Set(cols_dups)]
	const table_cols = []
	
	cols.forEach(col => {
		table_cols.push(
			{
				'Header': col,
				'accessor': col
			}
		)
	})

  	columns = React.useMemo(() => table_cols, [])

	// get table data
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
   
  const {
	getTableProps,
	getTableBodyProps,
	headerGroups,
	rows,
	prepareRow,
  } = useTable({ columns, data })

  return (
	<table {...getTableProps()} style={{ border: 'solid 1px blue', margin: '20px auto' }}>
	  <thead>
		{headerGroups.map(headerGroup => (
		  <tr {...headerGroup.getHeaderGroupProps()}>
			{headerGroup.headers.map(column => (
			  <th
				{...column.getHeaderProps()}
				style={{
				  borderBottom: 'solid 3px red',
				  background: 'aliceblue',
				  color: 'black',
				  fontWeight: 'bold',
				}}
			  >
				{column.render('Header')}
			  </th>
			))}
		  </tr>
		))}
	  </thead>
	  <tbody {...getTableBodyProps()}>
		{rows.map(row => {
		  prepareRow(row)
		  return (
			<tr {...row.getRowProps()}>
			  {row.cells.map(cell => {
				return (
				  <td
					{...cell.getCellProps()}
					style={{
					  padding: '10px',
					  border: 'solid 1px gray',
					  background: 'papayawhip',
					}}
				  >
					{cell.render('Cell')}
				  </td>
				)
			  })}
			</tr>
		  )
		})}
	  </tbody>
	</table>
  )
}
export default Table