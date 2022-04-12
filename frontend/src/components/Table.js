import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { formatDataForReact } from '../utils/format_data'
import { matchSorter } from 'match-sorter'
import { getCSV } from '../utils/htmlTableToCsv'

// Define a default UI for filtering
function GlobalFilter({
	preGlobalFilteredRows,
	globalFilter,
	setGlobalFilter,
  }) {
	const count = preGlobalFilteredRows.length
	const [value, setValue] = React.useState(globalFilter)
	const onChange = useAsyncDebounce(value => {
	  setGlobalFilter(value || undefined)
	}, 200)
  
	return (
	  <span>
		Search:{' '}
		<input
		  value={value || ""}
		  onChange={e => {
			setValue(e.target.value);
			onChange(e.target.value);
		  }}
		  placeholder={`${count} records...`}
		  style={{
			fontSize: '1.1rem',
			border: '0',
		  }}
		/>
	  </span>
	)
  }
  
  // Define a default UI for filtering
  function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
  }) {
	const count = preFilteredRows.length
  
	return (
	  <input
		value={filterValue || ''}
		onChange={e => {
		  setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
		}}
		placeholder={`Search ${count} records...`}
	  />
	)
  }

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
  
  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val

const Table = (props) => {
	let { samples, schema } = props;
	if (!samples || !samples.length) samples = []
	if (!schema || !schema.length) schema = []
	let data = []
	let  columns = []

	// if (!samples || samples.length === 0) return <p>No repos, sorry</p>;

	const [columns_, data_] = formatDataForReact(samples, schema)

	columns = React.useMemo(() => columns_, [])
	data = React.useMemo(() => data_, [])
	const filterTypes = React.useMemo(
		() => ({
		  	// Add a new fuzzyTextFilterFn filter type.
		  	fuzzyText: fuzzyTextFilterFn,
		  	// Or, override the default text filter to use
		  	// "startWith"
		  	text: (rows, id, filterValue) => {
				return rows.filter(row => {
			  		const rowValue = row.values[id]
			  		return rowValue !== undefined
						? String(rowValue)
							.toLowerCase()
							.startsWith(String(filterValue).toLowerCase())
							: true
					})
		  		},
			}),
		[]
	  )

	const defaultColumn = React.useMemo(
		() => ({
		  // Let's set up our default Filter UI
		  Filter: DefaultColumnFilter,
		}),
		[]
	)
   
  const {
	getTableProps,
	getTableBodyProps,
	headerGroups,
	rows,
	prepareRow,
	state,
	visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
	  	{ 
			columns, 
			data,
			defaultColumn, // Be sure to pass the defaultColumn option
      		filterTypes,
		},
		useFilters,
		useGlobalFilter
	)

  return (
		<div className='flex-auto'>
			<button
				onClick={getCSV}
				className='float-right inline-block font-bold text-sm px-4 py-2 bg-gray-200 hover:bg-red-900 leading-none border border-2 rounded text-white hover:border-white border-transparent text-red-900 hover:text-white border-red-900 mt-20 mb-2'
			>
				Download CSV
			</button>
			<table
				{...getTableProps()}
				className='m-auto border-4 border-opacity-25 border-collapse mb-10 mt-6 border-red-900'
			>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps()}
									className='border border-opacity-50 border-red-900 p-5 bg-gray-200'
								>
									{column.render('Header')}
									<div>
										{column.canFilter
											? column.render('Filter')
											: null}
									</div>
								</th>
							))}
						</tr>
					))}
					<tr>
						<th
							colSpan={visibleColumns.length}
							style={{
								textAlign: 'left',
							}}
						>
							<GlobalFilter
								preGlobalFilteredRows={preGlobalFilteredRows}
								globalFilter={state.globalFilter}
								setGlobalFilter={setGlobalFilter}
							/>
						</th>
					</tr>
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<td
											{...cell.getCellProps()}
											className='border border-opacity-50 border-red-600 py-2 px-1'
										>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
	return rows.filter(row => {
	  const rowValue = row.values[id]
	  return rowValue >= filterValue
	})
  }
  
  // This is an autoRemove method on the filter function that
  // when given the new filter value and returns true, the filter
  // will be automatically removed. Normally this is just an undefined
  // check, but here, we want to remove the filter if it's not a number
  filterGreaterThan.autoRemove = val => typeof val !== 'number'

export default Table