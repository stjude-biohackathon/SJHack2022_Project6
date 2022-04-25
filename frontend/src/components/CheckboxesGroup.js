import * as React from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export default function CheckboxesGroup(props) {
	let { table_name, columns, filterCallback } = props
	const [state, setState] = React.useState(columns)
  
	const handleChange = (event) => {
		const column = event.target.value
		const col = columns.find(c => c.column === column)
		col.visible = event.target.checked
	  	setState({
			...state,
			columns,
	  	})
		filterCallback(columns)
	}
  
	return (
	  <Box sx={{ display: 'flex' }}>
		<FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
		  <FormGroup>
		  	{
			  	columns.map(col => {
					const u_key = table_name + '+' + col.column
					return (
						<FormControlLabel
				  			control={
								<Checkbox checked={col.visible} onChange={handleChange} name={col.column} id={u_key} value={col.column} />
				  			}
				  			label={col.column + (col.is_primary ? ' *' : '') + (col.is_foreign ? ' ~' : '')}
						/>
					)
				})
			}
		  </FormGroup>
		</FormControl>
	  </Box>
	)
  }
  