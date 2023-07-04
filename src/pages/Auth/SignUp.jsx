import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import googleImg from "../../assets/google.png";
import axios from "axios";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!name) {
      errors.name = "Nome é obrigatório!";
    }
    if (!email) {
      errors.email = "E-mail é obrigatório!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "E-mail inválido";
    }
    if (!password) {
      errors.password = "Senha é obrigatória!";
    } else if (password.length < 6) {
      errors.password = "Senha deve ter no mínimo 6 caracteres!";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem!";
    }
    setErrors(errors);

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
    };

    try {
      const response = await axios.post(
        "https://popfollow-server.vercel.app/auth/register",
        formData
      );
      // console.log(response.data);
      alert(response.data); // Aqui você pode tratar a resposta do backend
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </div>
        <div className="form__group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="form__error">{errors.email}</span>}
        </div>
        <div className="form__group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="form__error">{errors.password}</span>
          )}
        </div>
        <div className="form__group">
          <label htmlFor="confirmPassword">Confirme a senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="form__error">{errors.confirmPassword}</span>
          )}
        </div>
        <button className="form__button" type="submit">
          Cadastrar
        </button>
        <div className="form__or">
          <div className="divider">
            <span> Ou </span>
          </div>
          <div className="google">
            <img src={googleImg} alt="" />
            <span>Cadastre-se com o Google</span>
          </div>
        </div>
        <span className="form__swap">
          Já tem uma conta? <Link to={"/signin"}> Faça o login! </Link>
        </span>
      </form>
    </div>
  );
};

export default Form;
