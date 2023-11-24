import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import DataContent from '../context/DataContext'

function Login() {
  const navigate = useNavigate();
  const { setSidebarToggler } = useContext(DataContent)

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const newUser = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      await setDoc(doc(db, 'users', user.uid), newUser);

      console.log('User data saved!');
      setSidebarToggler(false)
      navigate('/');
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] bg-[#F0F0F0] relative z-[20] overflow-hidden">
      <div className='w-full h-[20%] text-[30px] text-textblack flex items-center justify-center bg-[#4ec0a5]'> 
        WhatsApp Web clone by Festus Asiyanbi
      </div>
      <div className="login-container bg-white w-[400px] m-auto h-[400px] flex items-center justify-center flex-col rounded-[8px] z-[10]">
        <img
          className="w-[150px] h-[150px] mb-[20px]"
          src={process.env.PUBLIC_URL + 'asset/images/whatsapp-logo.png'}
          alt=""
        />
        <p className="text-[17px] font-[500] mb-[20px] text-textblack">WhatsApp Web</p>
        <button 
          className="flex items-center h-[40px] w-[200px] justify-center border-none outline-none bg-[#00755a] text-white text-[15px] rounded-[5px] cursor-pointer hover:bg-[#005541]" 
          onClick={signInWithGoogle}>
          <img
            src={process.env.PUBLIC_URL + 'asset/images/google-logo.png'}
            alt="login with Google"
            className='w-[20px] mr-[10px]'
          />
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
