import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState} from "react";
import { AuthContext } from '../../AuthContext'
import "./styles.scss";

function SigninForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleCallackResponse(response) {
    const googleToken = response.credential;
    // Enviar o token para o backend
    axios.post("https://popfollow-server.vercel.app/auth/google", {  googleToken })
      .then((response) => {
        const { token, user } = response.data;
        login(user, token);
        navigate("/");
      })
      .catch((error) => {
        console.log("Erro:" + error.response.data.message);
      });
  }

  useEffect(() => {
    const handleGoogleLoad = () => {
      const signInDiv = document.getElementById("signInDiv");
      if (signInDiv) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCallackResponse
        });
  
        google.accounts.id.renderButton(
          signInDiv, 
          { theme: "outline", size: "large"}
        )
      } else {
        console.log('Elemento signInDiv não encontrado'); // Verificar se o elemento não foi encontrado
      }
    }
  
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = handleGoogleLoad;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await axios.post(
        "https://popfollow-server.vercel.app/auth/login",
        formData
      );
      const {token, userLogin: user} = response.data
      login(user, token)
     return navigate("/");
    } catch (error) {
      alert(error.response.data.message)
    }
  };


  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {/* <h2 className="form__title">Login</h2> */}
        <div className="form__group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form__group">
          <label htmlFor="password">Senha:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="form__button">
          Entrar
        </button>
        {/* <div className="form__or">
          <div className="divider">
            <span> Ou </span>
          </div>
          <div id="signInDiv" >
            
          </div>
        </div> */}

        <span className="form__swap">
          Não tem uma conta? <Link to={"/signup"}> Faça o cadastro! </Link>
        </span>
      </form>
    </div>
  );
}

export default SigninForm;
