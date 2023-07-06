import "./home.scss";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
import Loader from '../../components/Loader/Loader'
import {
  getTitles,
  getFavorites,
  markAsFavorite,
  removeFromFavorites,
} from "../../assets/titlesApi";


function Home({ searchValue, onFilter }) {
  const { token, user } = useContext(AuthContext);
  const [titles, setTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [favoriteTitles, setFavoriteTitles] = useState([]);
  
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
        const fetchedTitles = await getTitles(token);
        const favorites = await getFavorites(token, userId);
  
        const favoriteTitleIds = favorites.map((title) => title._id);
  
        const titlesWithFavorites = fetchedTitles.map((title) => ({
          ...title,
          favorite: favoriteTitleIds.includes(title._id),
        }));
  
        setTitles(titlesWithFavorites);
        setFilteredTitles(titlesWithFavorites); 
        setFavoriteTitles(favoriteTitleIds);
      }
  
      fetchData();
    }, [token, user]);
  
    useEffect(() => {
      const filtered = titles.filter((title) =>
        title.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTitles(filtered);
    }, [titles, searchValue]);

  
    const isTitleFavorite = (titleId) => {
      return favoriteTitles.includes(titleId);
    };
  
    const handleFavoriteClick = async (titleId) => {
      try {
        if (isTitleFavorite(titleId)) {
          await removeFromFavorites(token, titleId, userId);
          setFavoriteTitles((prevFavorites) =>
            prevFavorites.filter((id) => id !== titleId)
          );
        } else {
          await markAsFavorite(token, titleId, userId);
          setFavoriteTitles((prevFavorites) => [...prevFavorites, titleId]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (titles.length === 0) {
      return <Loader />;
    }

    

    return (
      <div className="home">
        <Cards>
        {filteredTitles.map((title) => (
            <div className="card" key={title._id}>
              <Link 
                to={`/details/${title._id}`} 
                className="card__link"
                onClick={() => onFilter('')}
              >
                <div className="card__image">
                  <img
                    loading="lazy"
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
                onClick={() => handleFavoriteClick(title._id)}
                className={`card__favorite ${
                  isTitleFavorite(title._id) ? "favorited" : ""
                }`}
              >
                <AiFillHeart />
              </button>
            </div>
        ))}
        </Cards>
      </div>
    );
  }
  
  export default Home;