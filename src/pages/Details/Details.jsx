import './details.scss'
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {AuthContext} from '../../AuthContext'
import {IoCaretBack , IoAdd, IoCheckmarkOutline}  from 'react-icons/io5'
import axios from 'axios';
import Loader from '../../components/Loader/Loader'
import {
  getFavorites,
  getWatcheds,
  markAsFavorite,
  removeFromFavorites,
} from "../../assets/titlesApi";

function Details() {
  const { token, user} = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [titleDetails, setTitleDetails] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [watchedMovie, setWatchedMovie] = useState(false);
  const [favoriteTitles, setFavoriteTitles] = useState([]);
  const [watcheds, setWatcheds] = useState([])
  const isTitleFavorite = (titleId) => favoriteTitles.includes(titleId);
  const defaultImage =
    "https://img.freepik.com/vetores-premium/padrao-sem-emenda-com-filmes-e-series-de-programas-de-tv-de-cinema-engracado-doodle-vetor-icones-desenhados-a-mao-colorfu_497982-414.jpg?w=2000";
  
  let userId;
  if (typeof user === 'string') {
    const getUser = JSON.parse(user);
    userId = getUser._id;
  } else {
    userId = user._id;
  }
  

  const handleGoBack = () => {
    navigate(-1);
    // Evitar ficar ainda o ultimo filtro ao voltar na pilha
    // setTimeout(() => {
    //   window.location.reload()
    // }, 2000);    
  };

  useEffect(() => {
      async function fetchData() {
      const [favorites, watchedsList] = await Promise.all([
        getFavorites(token, userId),
        getWatcheds(token, userId),
      ]);
      const favoriteTitleIds = favorites.map((title) => title._id);
      setFavoriteTitles(favoriteTitleIds);
      setWatcheds(watchedsList)
    }

    fetchData();
  }, [token, user, id]);



  // Pegar os detalhes do titulo pelo id
  useEffect(() => {
    const fetchTitleDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.get(`https://popfollow-server.vercel.app/title/${id}`, config);
        setTitleDetails(response.data);

        const watchedTitle = watcheds.find((watched) => watched.titleId === id);
        if (watchedTitle) {
          if (watchedTitle.watchedMovie) {
            setWatchedMovie(true);
          }
          if (watchedTitle.watchedEpisodes) {
            setWatchedEpisodes(watchedTitle.watchedEpisodes);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTitleDetails();
  }, [id, token, watcheds]);
  
  if (!titleDetails) {
    return <Loader />;
  }

  const handleToggleOverview = () => setShowFullOverview(!showFullOverview);

  const overviewText = showFullOverview
  ? titleDetails.overview
  : titleDetails.overview.slice(0, 150) ;

  const isMovie = titleDetails.type === 'Filme';

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

  const handleToggleMovie = async (titleId, type) => {
    try {
      console.log(token)
      const updatedTitle = { userId, titleId, type, watched: !watchedMovie};
      await axios.put(`https://popfollow-server.vercel.app/title/watched/${id}`, updatedTitle, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWatchedMovie((prevValue) => !prevValue);
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggleEpisode = async (episodeNumber, titleId, type) => {
    try {
      const updateWatched = watchedEpisodes.includes(episodeNumber)
      ? watchedEpisodes.filter((ep) => ep !== episodeNumber)
      : [...watchedEpisodes, episodeNumber]

      const updatedTitle = {
        userId,
        titleId,
        type,
        watched: episodeNumber
      };
      console.log(token)
      await axios.put(`https://popfollow-server.vercel.app/title/watched/${id}`, updatedTitle, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWatchedEpisodes(updateWatched);
    } catch (error) {
      console.log(error);
    }
  };

  // Verificar se tem imagem background
  if(titleDetails.backgroundImg === "Não informado"){
    titleDetails.backgroundImg = ""
  }


  return (
    <div className='details'>
      <div className="details__back" onClick={handleGoBack}>
        <IoCaretBack />
      </div>
      <div className='details__image'>
        <img src={          
          titleDetails.backgroundImg
              ? `https://image.tmdb.org/t/p/w500/${titleDetails.backgroundImg}`
              : defaultImage
          }
          alt="Imagem de fundo" />
      </div>
      <div className="details__addFavorites">
        <button onClick={() => handleFavoriteClick(titleDetails._id)}>
          {favoriteTitles.includes(titleDetails._id) ? <IoCheckmarkOutline /> : <IoAdd />}
        </button>
      </div>
      <div className='details__title'>
        <h1 >{titleDetails.name}</h1>
      </div>
      <div className="details__genres">
        {titleDetails.genres.map(genre => (
          <span key={genre}>{genre}</span>
        ))}
      </div>
      <div className="details__duration">
      {isMovie ? <span>{titleDetails.duration} min</span> : <span>{titleDetails.episodes} episódios</span>}
      </div>
      <div className="details__overview">
        <h2>Sinopse</h2>
        <p>{overviewText}</p>
        {titleDetails.overview.length > 150 && (
          <button onClick={handleToggleOverview}>
            {showFullOverview ? 'Ver menos.' : 'ver mais...'}
          </button>
        )}
      </div>
      <div className="details__watched">
      {isTitleFavorite(titleDetails._id) && (  
        isMovie ? (
          <div>
            <input
              type="checkbox"
              id="watchedMovie"
              name="watchedMovie"
              checked={watchedMovie}
              onChange={() => handleToggleMovie(titleDetails._id, titleDetails.type)}
            />
            <label htmlFor="watchedMovie">Marcar como assistido</label>
          </div>
        ) : (
          Array.from({ length: titleDetails.episodes }, (_, index) => index + 1).map((episodeNumber) => (
            <div key={episodeNumber}>
              <input
                type="checkbox"
                id={`episode-${episodeNumber}`}
                name={`episode-${episodeNumber}`}
                checked={watchedEpisodes.includes(episodeNumber)}
                onChange={() => handleToggleEpisode(episodeNumber, titleDetails._id, titleDetails.type)}
              />
              <label htmlFor={`episode-${episodeNumber}`}>Episódio {episodeNumber}</label>
            </div>
          ))
        )
      )}
      </div>
    </div>
  );
}

export default Details;