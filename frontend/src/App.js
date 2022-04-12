import React, { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import Nav from './components/Nav';
import WithTableLoading from './components/withTableLoading';

function App() {
  const TableLoading = WithTableLoading(Table);
  const [appState, setAppState] = useState({
    loading: false,
    samples: null,
    loggedIn: false
  });

  useEffect(() => {

    setAppState(prevState => {
        return {...prevState, loading: true }
    });

    const apiUrl = `http://localhost:8000/api/data/`

    fetch(apiUrl)
      .then((res) => res.json())
      .then((values) => {
        const samples = values.results.filter(v => v.table_name === 'Samples')
        setAppState(prevState => {
            return {...prevState, loading: false};
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
            console.log('logout @ App');
            setAppState(prevState => {
                return {...prevState, loggedIn: false};
            });
      }
  }

  console.log(appState)

  return (
    <div className='App'>
      <div className='w-full mx-auto'>
        <Nav handleLogin={login} loggedIn={appState.loggedIn} />
      </div>
      <div className='repo-container'>
        <h3 className='text-3xl mx-auto my-5'>Table: Samples</h3>
        {appState.loggedIn && <TableLoading isLoading={appState.loading} samples={appState.samples} />}
      </div>
      <footer>
        <div className='footer'>
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
