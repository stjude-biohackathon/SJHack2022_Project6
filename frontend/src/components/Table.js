import React from 'react'
import { useTable } from 'react-table'
import { formatDataForReact } from '../utils/format_data'

const Table = (props) => {
	let { samples } = props;
	if (!samples || !samples.length) samples = []
	let data = []
	let  columns = []

	// if (!samples || samples.length === 0) return <p>No repos, sorry</p>;

	const [columns_, data_] = formatDataForReact(samples)

	columns = React.useMemo(() => columns_, [])
	data = React.useMemo(() => data_, [])
   
  const {
	getTableProps,
	getTableBodyProps,
	headerGroups,
	rows,
	prepareRow,
  } = useTable({ columns, data })

  return (
	<div className='flex-auto'>
		<table {...getTableProps()} className='m-auto border-4 border-opacity-25 border-collapse mb-10 mt-20 border-red-900'>
			<thead>
				{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
					<th
						{...column.getHeaderProps()}
						className = 'border border-opacity-50 border-red-900 p-5 bg-gray-200'
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
							className = 'border border-opacity-50 border-red-600 p-2'
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
	</div>
  )
}
export default Table