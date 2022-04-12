import React, { useEffect, useState } from 'react';
import './App.css';
import Nav from './components/Nav';
import Filters from './components/Filters';
import Table from './components/Table';
import WithTableLoading from './components/withTableLoading';

function App() {
  const TableLoading = WithTableLoading(Table);
  const [appState, setAppState] = useState({
    loading: false,
    schema: null,
    samples: null,
    loggedIn: true
  });

  useEffect(() => {

    setAppState(prevState => {
        return {...prevState, loading: true }
    });

    const schema_url = `http://localhost:8000/api/schema/`
    const data_url = `http://localhost:8000/api/data/`

    fetch(data_url)
      .then((res) => res.json())
      .then((values) => {
        const samples = values.results.filter(v => v.table_name === 'Samples')
        fetch(schema_url)
          .then((res) => res.json())
          .then((cols) => {
            const schema = cols.results
            setAppState(prevState => {
              return {...prevState, loading: false, schema, samples};
          })
        })
      });
  }, [setAppState])

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
    <div className='App flex flex-col justify-between h-screen'>
      <div className='w-full mx-auto'>
        <Nav handleLogin={login} loggedIn={appState.loggedIn} />
      </div>
      <div className='repo-container items-start h-screen'>
        {/* <h3 className='text-3xl mx-auto my-5'>Table: Samples</h3> */}
        <div className='flex flex-nowrap'>
          <Filters schema={appState.schema} />
          {appState.loggedIn && <TableLoading isLoading={appState.loading} samples={appState.samples} />}
        </div>
      </div>
      <footer>
        <div className='footer h-10 bg-gray-200 p-2'>
          Built with{' '}
          <span role='img' aria-label='love'>
          ❤️
          </span>{' '}
          by St. Jude BioHackathon Team #6
        </div>
      </footer>
    </div>
  )
}

export default App;
