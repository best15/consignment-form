import { ToastContainer } from "react-toastify";
import { styled } from '@mui/material/styles';

import './App.css'
import FormComponent from './components/formComponent/FormComponent';

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
    backgroundColor: '#F2F2F2',
    [theme.breakpoints.down('sm')]: {
      width: '98vw',
      overflowX: 'hidden',
    },
  }));

  return (
    <>
    <Main>
      <FormComponent />
      <ToastContainer />
    </Main>
    </>
  )
}

export default App
