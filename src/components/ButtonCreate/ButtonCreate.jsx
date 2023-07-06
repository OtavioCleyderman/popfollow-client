import React, { useState } from "react";
import "./buttonCreate.scss";
import { TbCirclePlus } from "react-icons/tb";
import Modal from "../Modal/Modal";
import axios from "axios";

const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))
  

function ButtonCreate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoValue, setTipoValue] = useState("");
  const [overviewValue, setOverviewValue] = useState("");
  const [isAnimeOrSerie, setIsAnimeOrSerie] = useState(false);
  const [isMovie, setIsMovie] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOverviewChange = (event) => {
    const { value } = event.target;
    setOverviewValue(value);
  };

  const handleTipoChange = (event) => {
    const { value } = event.target;
    setTipoValue(value);
    setIsAnimeOrSerie(value === "Anime" || value === "Serie");
    setIsMovie(value === "Filme");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      type: document.getElementById("tipo").value,
      genre: document.getElementById("genero").value.split(",").map((genre) => genre.trim()),
      image: document.getElementById("imagem").value,
      episodes: document.getElementById("qtdeEp").value,
      overview: overviewValue,
      userId: user._id, // Você precisará fornecer o ID do usuário aqui
      status: "Em revisão...", // Valor padrão para o status
    };
     console.log(formData)

    try {
      const response = await axios.post(
        "https://popfollow-server.vercel.app/titles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.msg) 
      window.location.reload()
      handleCloseModal(); 
    } catch (error) {
      console.error(error);
      alert(error.response.data.msg)
    }
  };

  return (
    <div className="btn__container" title="Adicionar um título">
      <button className="btn btn__create" onClick={handleShowModal}>
        <TbCirclePlus />
      </button>
      <Modal className="modal" show={isModalOpen} onClose={handleCloseModal}>
        <h2>Adicione um título</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" />
          </div>
          <div className="form__group">
            <label htmlFor="tipo">Tipo:</label>
            <select name="tipo" id="tipo" value={tipoValue} onChange={handleTipoChange}>
              <option value="" default>
                Selecione..
              </option>
              <option value="Anime">Anime</option>
              <option value="Serie">Série</option>
              <option value="Filme">Filme</option>
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="genero">Gênero:</label>
            <small>Insira os gêneros separados por vírgula (por exemplo: comédia, ação, fantasia)</small>
            <input type="text" id="genero" />
          </div>
          <div className="form__group">
            <label htmlFor="overview">Sinopse:</label>
            <textarea id="overview" value={overviewValue} onChange={handleOverviewChange}></textarea>
          </div>
          <div className="form__group">
            <label htmlFor="imagem">Imagem:</label>
            <input type="text" id="imagem" placeholder="Insira um link.."/>
          </div>
          <div className={`form__group${isAnimeOrSerie ? "" : " form__group--hidden"}`}>
            <label htmlFor="qtdeEp">Quantidade total de episódios:</label>
            <input type="number" id="qtdeEp" />
          </div>
          <div className={`form__group${isMovie ? "" : " form__group--hidden"}`}>
            <label htmlFor="qtdeEp">Duração em minutos:</label>
            <input type="number" id="qtdeEp"/>
          </div>
          <button className="btn-submit">Enviar</button>
        </form>
      </Modal>
    </div>
  );
}

export default ButtonCreate;

