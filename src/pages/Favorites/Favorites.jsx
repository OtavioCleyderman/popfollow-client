import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
import Loader from '../../components/Loader/Loader'
import {
  getFavorites,
  removeFromFavorites,
} from "../../assets/titlesApi";
import './favorites.scss'

function Favorites({ searchValue, onFilter}) {
  const { token, user } = useContext(AuthContext);
  const [titlesFavorites, setTitlesFavorites] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [favoriteTitles, setFavoriteTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  let userId;
  if (typeof user === 'string') {
    const getUser = JSON.parse(user);
    userId = getUser._id;
  } else {
    userId = user._id;
  }

  const defaultImage =
    "https://img.freepik.com/vetores-premium/padrao-sem-emenda-com-filmes-e-series-de-programas-de-tv-de-cinema-engracado-doodle-vetor-icones-desenhados-a-mao-colorfu_497982-414.jpg?w=2000";

  useEffect(() => {
    
    async function fetchData() {
      const favorites = await getFavorites(token, userId);
      const favoriteTitleIds = favorites.map((title) => title._id);

      setTitlesFavorites(favorites);
      setFavoriteTitles(favoriteTitleIds);
      setIsLoading(false);
    }

    fetchData();
  }, [token, user]);

  useEffect(() => {
    const filtered = titlesFavorites.filter((title) =>
      title.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTitles(filtered);
  }, [titlesFavorites, searchValue]);

  const handleRemoveFavorite = async (titleId) => {
    try {
      
      await removeFromFavorites(token, titleId, userId);

      setTitlesFavorites(titlesFavorites.filter((title) => title._id !== titleId));
      setFavoriteTitles((prevFavorites) =>
        prevFavorites.filter((id) => id !== titleId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (titlesFavorites.length === 0) {
    return <div className="favorites">Nenhum título favoritado no momento!</div>;
  }

  return (
    <div className="favorites">
      <Cards >
      {filteredTitles.map((title) => (
          <div className="card" key={title._id}>
          <Link 
            to={`/details/${title._id}`} 
            className="card__link"
            onClick={() => onFilter('')}
          >
            <div className="card__image">
              <img
                src={
                  title.image
                    ? title.image.startsWith("http")
                      ? title.image
                      : `https://image.tmdb.org/t/p/w500/${title.image}`
                    : defaultImage
                }
                alt=""
              />
            </div>
            <div className="card__title">{title.name}</div>
            </Link>
            <button
              onClick={() => handleRemoveFavorite(title._id)}
              className="card__remove"
            >
              <TiDelete />
            </button>
          </div>
      ))}
      </Cards>
    </div>
  );
}

export default Favorites;