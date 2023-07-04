import axios from "axios";

export async function getTitles(token) {
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  }
  try {
      const response = await axios.get('https://popfollow-server.vercel.app/titles', config)
      return response.data.titles
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getFavorites(token, userId) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: { userId } 
  };
  try {
      const response = await axios.get('https://popfollow-server.vercel.app/title/favorite', config)
      const favorites = response.data.titlesFavorites

      // Verificar se existem filmes favoritos
    if (favorites.length > 0) {
      const favoriteIds = favorites.map(favorite => favorite.titleId);
      const titlesResponse = await axios.get('https://popfollow-server.vercel.app/title/list-by-id', { params: { ids: favoriteIds }, headers: { Authorization: `Bearer ${token}` } });
      const titles = titlesResponse.data.titles;
      
      return titles;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getWatcheds(token, userId) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: { userId } 
  };
  try {
      const response = await axios.get('https://popfollow-server.vercel.app/title/watcheds', config)
      const watcheds = response.data.titlesWatcheds

     return watcheds
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function markAsFavorite(token, titleId, userId) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.post(
    "https://popfollow-server.vercel.app/title/favorite",
    { titleId, userId },
    config
  );
}

export async function removeFromFavorites(token, titleId, userId) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    data: { titleId, userId },
  };
  await axios.delete("https://popfollow-server.vercel.app/title/favorite", config);
}