import React, {Component} from "react";
import SearchResults from 'react-filter-search';
import Moment from 'react-moment';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open(process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: ''
    };
  }
  componentWillMount() {
    fetch(process.env.REACT_APP_ADMIN_BASE_URL + '/api/locations')
      .then(response => response.json())
      .then(json => this.setState({ data: json }));
  }
  handleChange = event => {
    const { value } = event.target;
    this.setState({ value });
  };
  render() {
    const { data, value } = this.state;
    return (
      <div id="page" className="search-page">
        <div className="innerwidth innercontainer">

          <div className="search-head">
            <h5>Etsi</h5>
            <p>Hakunäkymä listaa kaikki paikat. Näkymä päivittyy haun edetessä.</p>
            <input type="text" value={value} onChange={this.handleChange} />
            <hr /></div>
          <SearchResults
            value={value}
            data={data}
            renderResults={results => (
              <div className="results">
                {results.reverse().map(search => (
                  <div className="result">
                    <Moment format="DD.MM.YYYY">
                      {search.createdAt}</Moment>
                    {''} <a href={'/edit/' + search.id}>
                      {search.title}
                    </a>
                  </div>
                ))}
              </div>
            )}
          />
        </div></div>

    );
  }
}
export default Search;
