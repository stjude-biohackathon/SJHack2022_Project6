import React, { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import WithTableLoading from './components/withTableLoading';

function App() {
  const TableLoading = WithTableLoading(Table);
  const [appState, setAppState] = useState({
    loading: false,
    samples: null,
  });

  useEffect(() => {

    setAppState({ loading: true })

    const apiUrl = `http://localhost:8000/api/data/`

    fetch(apiUrl)
      .then((res) => res.json())
      .then((values) => {
        const samples = values.results.filter(v => v.table_name === 'Samples')
        setAppState({ loading: false, samples })
      });
  }, [setAppState])

  console.log(appState)

  return (
    <div className='App'>
      <div className='container  mx-auto'>
        <h1 className='text-5xl my-10'>Simply Samples</h1>
      </div>
      <div className='repo-container'>
        <h3 className='text-3xl mx-auto my-5'>Table: Samples</h3>
        <TableLoading isLoading={appState.loading} samples={appState.samples} />
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
