import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { type LoginFormInputs, loginSchema } from './schema';

export function Login() {
  const { signIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await signIn(data);
    } catch (error) {
      alert('Erro ao entrar. Verifique suas credenciais.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}
      >
        <h2>Admin Login</h2>

        <input 
          type="email" 
          placeholder="Email" 
          {...register('email')} 
        />
        {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}

        <input 
          type="password" 
          placeholder="Senha" 
          {...register('password')} 
        />
        {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}