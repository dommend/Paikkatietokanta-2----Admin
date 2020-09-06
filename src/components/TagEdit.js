import React, {useState, useEffect} from 'react';
import LocationDataService from '../services/LocationService';
import TextareaAutosize from 'react-textarea-autosize';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode === 220) {
    window.open (process.env.REACT_APP_ADMIN_BASE_URL + '/add', '_self');
  }
};

toast.configure ({
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

const Location = props => {

    const initialLocationState = {
        id: null,
        tagName: '',
        tagDescription: '',
        tagFeaturedImage:'',
        tagURL:'',
        tagCoordinateE: '',
        tagCoordinateN: ''
      };
    
  const [currentTag, setCurrentTag] = useState (initialLocationState);

  const getTag = id => {
    LocationDataService.getTag (id)
      .then (response => {
        setCurrentTag (response.data);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  useEffect (
    () => {
      getTag (props.match.params.id);
    },
    [props.match.params.id]
  );

  const handleInputChange = event => {
    const {name, value} = event.target;
    setCurrentTag ({...currentTag, [name]: value});
  };

  const updateTag = () => {
    LocationDataService.updateTag (currentTag.id, currentTag)
      .then (response => {
        toast ('Päivitetty');
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const deleteTag = () => {
    LocationDataService.removeTag (currentTag.id)
      .then (response => {
        toast ('Avainsana poistettu');
        console.log (response.data);
        props.history.push ('/tagmanagement');
      })
      .catch (e => {
        console.log (e);
      });
  };
  return (
    <div id="page" className="edittag">
      {currentTag
        ? <div className="innerwidth edit-form">
            <div className="innercontainer">
              <button
                type="button"
                className="go-back"
                onClick={() => props.history.goBack ()}
              >
                <span className="material-icons">arrow_back_ios</span>
                {' '}
                Takaisin edelliselle sivulle
              </button>
              <h3>Muokkaa avaintunnistetta: {currentTag.tagName}</h3>
              <p>
                <small>
                  <a
                    href={
                      'https://paikkatietokanta.net/tag/' + currentTag.id
                    }
                  >
                    https://paikkatietokanta.net/tag/{currentTag.id}
                  </a>
                </small>
              </p>
            <form name="edit-tag"> 
            <div className="form-group"> 
            <div className="row">
            <label htmlFor="tagName">Avainsana</label>
                <input
                variant="outlined"
                type="text"
                size="small"
                id="tagName"
                name="tagName"
                minLength="2"
                value={currentTag.tagName}
                onChange={handleInputChange}
                className="form-control"
              /> <br />
            <label htmlFor="tagFeaturedImage">Kansikuvan URL-osoite</label>
                <input
                variant="outlined"
                type="text"
                size="small"
                id="tagFeaturedImage"
                name="tagFeaturedImage"
                minLength="2"
                value={currentTag.tagFeaturedImage}
                onChange={handleInputChange}
                className="form-control"
              /><br /> 
            <label htmlFor="tagDescription">Kuvaus</label>
            <TextareaAutosize
                variant="outlined"
                type="text"
                size="small"
                id="tagDescription"
                name="tagDescription"
                minLength="2"
                value={currentTag.tagDescription}
                onChange={handleInputChange}
                className="form-control"
              /> 
              <label htmlFor="tagURL">URL</label>
                <input
                variant="outlined"
                type="text"
                size="small"
                id="tagURL"
                name="tagURL"
                minLength="2"
                className="form-control"
                value={currentTag.tagURL}
                onChange={handleInputChange}
              /><br />
                 <div className="row nomargin">
              <div className="col-sm">
                <label htmlFor="tagCoordinateN">North</label>
                <input
                variant="outlined"
                type="number" step="any"
                size="small"
                id="tagCoordinateN"
                name="tagCoordinateN"
                value={currentTag.tagCoordinateN}
                className="form-control"
                onChange={handleInputChange}
              /></div>
              <div className="col-sm">
                <label htmlFor="tagCoordinateE">East</label>
                <input
                variant="outlined"
                type="number" step="any"
                size="small"
                id="tagCoordinateE"
                name="tagCoordinateE"
                value={currentTag.tagCoordinateE}
                className="form-control"
                onChange={handleInputChange}
              /></div></div>

              </div>  
              </div>    
              <div className="form-group subdetails">
                  <div className="row">
                    <div className="col-sm">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={e => {
                          if (
                            window.confirm (
                              'Haluatko varmasti poistaa avainsanan?'
                            )
                          )
                            deleteTag (e);
                        }}
                      >
                        Poista
                      </button>
                    </div>
                    <div className="col-sm">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={e => {
                          if (window.confirm ('Haluatko päivittää avainsanan?'))
                            updateTag (e);
                        }}
                      >
                        Päivitä
                      </button>    
                      </div>
                    </div>
                    </div> 
            </form>
            </div>
          </div>
        : <div className="innerwidth text-center">
            <p>Tagi poistettu kannasta.</p>
            <p><a href="./">Palaa etusivulle.</a></p>
          </div>}
    </div>
  );
};
export default Location;
