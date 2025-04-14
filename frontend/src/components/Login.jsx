import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useContext(AppContext);
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        const endpoint = state === 'Login' ? 'login' : 'register';
        const { data } = await axios.post(`/api/user/${endpoint}`, { name, email, password });
        

      if (data.success) {
        navigate('/');
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10'
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className='relative bg-white p-10 rounded-xl text-slate-500 w-[90%] max-w-md'
      >
        <h1 className='text-center text-2xl font-medium text-neutral-700'>{state}</h1>
        <p className='text-sm text-center'>Welcome back! Please sign in to continue</p>

        {state !== 'Login' && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.profile_icon} alt='' className='w-5' />
            <input
              className='outline-none text-sm w-full'
              type='text'
              placeholder='Full name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} alt='' />
          <input
            className='outline-none text-sm w-full'
            type='email'
            placeholder='Email id'
            autoComplete='username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt='' />
          <input
            className='outline-none text-sm w-full'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={showPassword ? assets.eye : assets.hidden}
            alt='toggle visibility'
            className='w-5 cursor-pointer filter grayscale opacity-50'
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>

        <p className='text-sm text-emerald-600 my-4 cursor-pointer'>Forgot Password?</p>

        <button
          type='submit'
          className='bg-emerald-600 w-full text-white py-2 rounded-full cursor-pointer'
        >
          {state === 'Login' ? 'Login' : 'Create Account'}
        </button>

        {state === 'Login' ? (
          <p className='mt-5 text-center'>
            Don&apos;t have an account?
            <span className='cursor-pointer text-emerald-600' onClick={() => setState('SignUp')}>
              {' '}
              SignUp{' '}
            </span>
          </p>
        ) : (
          <p className='mt-5 text-center'>
            Already have an account?
            <span className='cursor-pointer text-emerald-600' onClick={() => setState('Login')}>
              {' '}
              Login{' '}
            </span>
          </p>
        )}

        <img
          onClick={() => setShowUserLogin(false)}
          src={assets.cross_icon}
          alt='close'
          className='absolute top-5 right-5 cursor-pointer w-5'
        />
      </form>
    </div>
  );
};

export default Login;
