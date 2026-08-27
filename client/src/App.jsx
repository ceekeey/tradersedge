import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ style: { background: '#151921', color: '#F3F4F6', border: '1px solid #232936' } }} />
    </BrowserRouter>
  );
};

export default App;
