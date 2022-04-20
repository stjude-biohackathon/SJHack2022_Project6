import React, { useEffect, useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import Filters from './components/Filters'
import Table from './components/Table'
import WithTableLoading from './components/withTableLoading'
import WithFiltersLoading from './components/withFilterLoading'
import githubImg from './static/GitHub-Mark-32px.png'

function App() {
  const TableLoading = WithTableLoading(Table)
  const FiltersLoading = WithFiltersLoading(Filters)
  const [appState, setAppState] = useState({
    loading: false,
    schema: null,
    samples: null,
    columns: null,
    default_table: null,
    loggedIn: true
  });
  const schema_url = `http://localhost:8000/api/schema/`
  const data_table_url = `http://localhost:8000/api/data/?table_name=`
  const data_tables_url = `http://localhost:8000/api/data/?table_name__in=`

  useEffect(() => {

    setAppState(prevState => {
        return {...prevState, loading: true }
    });

    let default_table
    //  = 'ProjectRequest' // remove comment for sujuan's data
   
    fetch(schema_url)
      .then((res) => res.json())
      .then((cols) => {
        const schema = cols.results
        setAppState(prevState => {
          default_table = schema[0].table_name
          fetch(data_table_url + default_table)
            .then((res) => res.json())
            .then((values) => {
              const samples = values.results
              const columns = schema.filter(t => t.table_name === default_table)
              setAppState(prevState => {
                return {...prevState, loading: false, schema, samples, columns};
              })
            })
          return {...prevState, loading: false, schema, default_table};
        })
      })
    
    
}, [setAppState])

  const handleFilterCallback = (columns) => {
    setAppState(prevState => {
      return {...prevState, loading: true }
    });
    const visible_tables = [...new Set(columns.map(c => c.table_name))]
    fetch(data_tables_url + visible_tables.join(','))
    .then((res) => res.json())
    .then((values) => {
      const samples = values.results
      setAppState(prevState => {
        return {...prevState, loading: false, columns, samples};
      })
    })
  }
  console.log(appState)

  const login = (user, pwd) => {
      if(user && pwd) {
          console.log('login @ App');
          if((user === 'admin') & (pwd === '123')) {
                setAppState(prevState => {
                    return {...prevState, loggedIn: true};
                });
          } 
      } else {
            // console.log('logout @ App');
            setAppState(prevState => {
                return {...prevState, loggedIn: false};
            });
      }
  }

  // console.log(appState)

  return (
    <div className='App flex flex-col justify-start h-screen'>
      <div className='w-full mx-auto sticky top-0'>
        <Nav handleLogin={login} loggedIn={appState.loggedIn} />
      </div>
      <div className='repo-container items-start h-full'>
        {/* <h3 className='text-3xl mx-auto my-5'>Table: Samples</h3> */}
        <div className='flex flex-nowrap'>
          <FiltersLoading isLoading={appState.loading} samples={appState.samples} schema={appState.schema} columns={appState.columns} parentCallback = {handleFilterCallback} />
          {appState.loggedIn && <TableLoading isLoading={appState.loading} samples={appState.samples} schema={appState.schema} visible_cols={appState.columns} default_table={appState.default_table}/>}
        </div>
      </div>
      <footer className='fixed bottom-0 w-full'>
        <div className='footer h-10 bg-gray-200 p-2'>
          Built with{' '}
          <span role='img' aria-label='love'>
          ❤️
          </span>{' '}
          by St. Jude BioHackathon Team - 6
          <a href='https://github.com/stjude-biohackathon/SJHack2022_Project6' target='_blank'>
            <img className='inline mx-6' src={githubImg} alt='GitHub Link' />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App;
