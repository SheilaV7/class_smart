import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


export function EmailVerification() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verificando...');
  const navigate=useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('Email verificado exitosamente');
      } catch (error) {
        setStatus('Error en la verificación');
      }
    };

    verifyToken();
  }, [token]);

  return <div className='text-black text-xl font-bold'>
    <h1>{status}</h1>
    <button  className='bg-[#0FA0CC] p-3 rounded-lg w-full hover:bg-[#0c88ad] hover:cursor-pointer transition duration-300' onClick={()=>navigate('/client')}>Volver al Comercio</button>
    </div>;
}

