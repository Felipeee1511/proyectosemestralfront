import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import IntegrantesComponente from './views/IntegrantesComponente';
import SignInComponente from './views/SignInComponente';
import NavbarComponent from './views/NavbarComponente';
import HorarioComponente from './views/HorarioComponente';
import AgendarComponent from './views/Reservas/AgendarComponent';
import AgendarHorarioComponent from './views/Reservas/AgendarHorarioComponent';
import AgendarConfirmarComponent from './views/Reservas/AgendarConfirmarComponent';
import BienvenidoComponente from './views/BienvenidoComponente';

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/bienvenido" />} />

        <Route path="/bienvenido" element={<BienvenidoComponente />} />

        <Route path="/integrantes" element={<IntegrantesComponente />} />

        <Route path="/agendar" element={<AgendarComponent />} />
        <Route path="/agendar/horario" element={<AgendarHorarioComponent />} />
        <Route path="/agendar/confirmar" element={<AgendarConfirmarComponent />} />

        <Route path="/admin" element={<SignInComponente />} />
        <Route path="/admin/horario" element={<HorarioComponente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
