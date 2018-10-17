import { API_KEY } from '../config';
const FILM_BY_ID_URI = 'http://www.omdbapi.com/?i=';

/* Fetching diary films */
export const fetchDiaryFilms = (token, userID, searchTerm = '') => dispatch => {
  dispatch(fetchDiaryFilmsRequest());
  console.log('userID: ', userID);

  return fetch(`http://localhost:8080/api/films?userID=${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      console.log(response);
      return response.json();
    })
    .then(films => {
      console.log(films);
      return films[0].diaryFilms;
    })
    .then(diaryFilms => {
      if (searchTerm !== '') {
        // Filter and reverse the array so we have descending order
        const filteredDiary = diaryFilms
          .filter(film =>
            film.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .reverse();

        dispatch(fetchDiaryFilmsSuccess(diaryFilms, filteredDiary, searchTerm));
      } else {
        // Reverse the array so we have it in descending order
        const reversedDiaryFilms = diaryFilms.reverse();
        dispatch(
          fetchDiaryFilmsSuccess(
            reversedDiaryFilms,
            reversedDiaryFilms,
            searchTerm
          )
        );
      }
    })
    .catch(error => {
      console.error(error);
      dispatch(fetchDiaryFilmsError(error));
    });
};

/* === Adds film to diary === */
export const addFilmToDiary = (imdbID, userID, token) => dispatch => {
  dispatch(addFilmRequest());

  fetch(`${FILM_BY_ID_URI}${imdbID}${API_KEY}`)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(response => {
      console.log(response);
      // Make actors into an array without quotes
      const actors = response.Actors.replace(/"/g, '', -1)
        .replace(/,/g, '', -1)
        .split(' ');

      const newFilmObject = {
        userID,
        film: {
          imdbID,
          title: response.Title,
          plot: response.Plot,
          actors: actors,
          poster: response.Poster,
          ratings: response.Ratings,
          // TODO: make this dynamic somehow
          userRating: true
        }
      };

      return newFilmObject;
    })
    .then(film => {
      console.log(film);

      return fetch('http://localhost:8080/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(film)
      })
        .then(response => {
          return response.json();
        })
        .catch(err => console.error(err));
    })
    .then(userFilms => {
      console.log(userFilms);

      // Reverse the array so we have it in descending order
      const reversedDiaryFilms = userFilms.diaryFilms.reverse();

      dispatch(addFilmSuccess(reversedDiaryFilms));
    })
    .catch(error => {
      console.log('hitting error in update watched status');
      console.error(error);
      dispatch(addFilmError(error));
    });
};

/* === Removes film from diary === */
export const removeFilmFromDiary = (imdbID, userID, token) => dispatch => {
  console.log('hello?');
  dispatch(removeFilmRequest());

  fetch(`http://localhost:8080/api/films`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      userID,
      imdbID
    })
  })
    .then(() => dispatch(removeFilmSuccess()))
    .then(() => dispatch(fetchDiaryFilms(token, userID)))
    .catch(error => dispatch(removeFilmError(error)));
};

/* === Toggles a film's liked status === */
export const toggleFilmLiked = (imdbID, userID, token) => dispatch => {
  dispatch(toggleLikedRequest());

  return fetch(`http://localhost:8080/api/films`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      userID,
      imdbID
    })
  })
    .then(response => response.json())
    .then(userFilms => dispatch(toggleLikedSuccess(userFilms.diaryFilms)))
    .then(() => dispatch(fetchDiaryFilms(token, userID)))
    .catch(error => dispatch(toggleLikedError(error)));
};

/* === SYNC actions === */
// Add
export const ADD_FILM_REQUEST = 'ADD_FILM_REQUEST';
export const addFilmRequest = () => ({
  type: ADD_FILM_REQUEST
});

export const ADD_FILM_SUCCESS = 'ADD_FILM_SUCCESS';
export const addFilmSuccess = diaryFilms => ({
  type: ADD_FILM_SUCCESS,
  diaryFilms
});

export const ADD_FILM_ERROR = 'SEARCH_FILM_ERROR';
export const addFilmError = error => ({
  type: ADD_FILM_ERROR,
  error
});

// Fetch
export const FETCH_DIARY_FILMS_REQUEST = 'FETCH_DIARY_FILMS_REQUEST';
export const fetchDiaryFilmsRequest = () => ({
  type: FETCH_DIARY_FILMS_REQUEST
});

export const FETCH_DIARY_FILMS_SUCCESS = 'FETCH_DIARY_FILMS_SUCCESS';
export const fetchDiaryFilmsSuccess = (
  diaryFilms,
  filteredDiaryFilms,
  searchTerm
) => ({
  type: FETCH_DIARY_FILMS_SUCCESS,
  diaryFilms,
  filteredDiaryFilms,
  searchTerm
});

export const FETCH_DIARY_FILMS_ERROR = 'FETCH_DIARY_FILMS_ERROR';
export const fetchDiaryFilmsError = error => ({
  type: FETCH_DIARY_FILMS_ERROR,
  error
});

// Remove
export const REMOVE_FILM_REQUEST = 'REMOVE_FILM_REQUEST';
export const removeFilmRequest = () => ({
  type: REMOVE_FILM_REQUEST
});

export const REMOVE_FILM_SUCCESS = 'REMOVE_FILM_SUCCESS';
export const removeFilmSuccess = () => ({
  type: REMOVE_FILM_SUCCESS
});

export const REMOVE_FILM_ERROR = 'REMOVE_FILM_ERROR';
export const removeFilmError = error => ({
  type: REMOVE_FILM_ERROR,
  error
});

// Toggle liked status
export const TOGGLE_LIKED_REQUEST = 'TOGGLE_LIKED_REQUEST';
export const toggleLikedRequest = () => ({
  type: TOGGLE_LIKED_REQUEST
});

export const TOGGLE_LIKED_SUCCESS = 'TOGGLE_LIKED_SUCCESS';
export const toggleLikedSuccess = diaryFilms => ({
  type: TOGGLE_LIKED_SUCCESS,
  diaryFilms
});

export const TOGGLE_LIKED_ERROR = 'TOGGLE_LIKED_ERROR';
export const toggleLikedError = error => ({
  type: TOGGLE_LIKED_ERROR,
  error
});
