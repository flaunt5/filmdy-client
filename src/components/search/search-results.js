// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { updateWatchedStatus } from '../../actions/search-actions';

// Components
import SearchResultCard from './search-result-card/search-result-card';

// Styles
import './search-results.css';
import { fetchDiaryFilms } from '../../actions/diary-actions';

export class SearchResults extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchDiaryFilms(this.props.token, this.props.userID));
    // this.props.dispatch(updateWatchedStatus(this.props.searchTerm));
  }

  generateFilmResults() {
    return this.props.searchResults.map((film, index) => {
      return (
        <li key={index}>
          <SearchResultCard film={film} diaryFilms={this.props.diaryFilms} />
        </li>
      );
    });
  }

  render() {
    return <ul>{this.generateFilmResults()}</ul>;
  }
}

const mapStateToProps = state => ({
  searchResults: state.search.searchResults,
  diaryFilms: state.diary.diaryFilms,
  userID: state.auth.currentUser.id,
  token: localStorage.getItem('authToken')
});

export default connect(mapStateToProps)(SearchResults);
