import { styled } from '@mui/material/styles';

import './App.css'

function App() {
  const Main = styled('main')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(2),
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    backgroundColor: '#9E9E9E',
    [theme.breakpoints.down('sm')]: {
      width: '98vw',
      overflowX: 'hidden',
    },
  }));

  return (
    <>
    <Main>
        <h1>Consignment Form</h1>
    </Main>
    </>
  )
}

export default App
