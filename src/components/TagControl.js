import React, { useState, useEffect } from 'react';
import LocationDataService from '../services/LocationService';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

toast.configure({
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});


const LocationsTagList = () => {
  const [locations, setLocations] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [locationTags, setLocationTags] = useState([]);
  const [selectedLocationTags, setSelectedLocationTags] = useState([]);
  const [selectedLocationPost, setSelectedLocationPost] = useState([]);

  useEffect(() => {
    retrieveLocations();
    retrieveLocationTags();
  }, []);

  const retrieveLocationTags = () => {
    LocationDataService.getAllTags()
      .then(response => {
        setLocations(response.data.reverse());
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveLocations = () => {
    LocationDataService.getAll()
      .then(response => {
        setLocationList(response.data.reverse());
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleTags = e => {
    const { name, value } = e.target;
    setLocationTags({ ...locationTags, [name]: value });
  };

  const handleTagSelection = e => {
    const { value } = e.target;
    setSelectedLocationTags({ ...selectedLocationTags, id: value });
  };


  const handlePostSelection = e => {
    const { value } = e.target;
    setSelectedLocationPost({ ...selectedLocationPost, id: value });
  };


  const addLocationTag = e => {
    e.preventDefault();
    if(!locationTags.tagName) {
      toast('Avainsana ei voi olla tyhjä.')
    } else {
    var data = {
      name: locationTags.tagName.toLowerCase(),
      featuredImage: locationTags.tagFeaturedImage, 
      description: locationTags.tagDescription,
      url: locationTags.tagURL,
      coordinateE: locationTags.tagCoordinateE,
      coordinateN: locationTags.tagCoordinateN
    }
    LocationDataService.createTag(data)
    .then (response => {
      toast (response.data);
      retrieveLocationTags();
      console.log (response.data);
    })
    .catch (e => {
      toast (e);
      console.log (e);
    }); 
  }
};

  const addLocationTagToArticle = () => {
    if(!selectedLocationTags.id || !selectedLocationPost.id) {
      toast('Varmista, että tunniste ja paikka on valittu.')
    } else {
    LocationDataService.addTagToPost({ tagID: selectedLocationTags.id, locationID: selectedLocationPost.id })
      .then(response => {
        toast(response.data)
        console.log(response.data);
      })
      .catch(e => {
        toast(e)
        console.log(e);
      }); }

  };

  return (

 
    <div id="page" className="TagControl">
      <div className="innerwidth">
        <div className="row">
          <div className="col-sm">
            <div className="form-group">
              <h5>Luo uusi tunniste</h5>
              <hr />


<label htmlFor="coordinates">Avainsana</label>

              <input
                variant="outlined"
                type="text"
                size="small"
                id="tagName"
                name="tagName"
                minLength="2"
                className="form-control"
                onChange={handleTags}
              /> <br />

<label htmlFor="coordinates">Kansikuvan URL-osoite</label>
                <input
                variant="outlined"
                type="text"
                size="small"
                id="tagFeaturedImage"
                name="tagFeaturedImage"
                minLength="2"
                className="form-control"
                onChange={handleTags}
              /><br />
              
<label htmlFor="coordinates">Kuvaus</label>
            <TextareaAutosize
                variant="outlined"
                type="text"
                size="small"
                id="tagDescription"
                name="tagDescription"
                minLength="2"
                className="form-control"
                onChange={handleTags}
              /> <br />
              

              <label htmlFor="coordinates">URL-osoite</label>
                <input
                variant="outlined"
                type="text"
                size="small"
                id="tagURL"
                name="tagURL"
                minLength="2"
                className="form-control"
                onChange={handleTags}
              /><br />


              <div className="row nomargin">
              <div className="col-sm">
              <label htmlFor="coordinates">North</label>
                <input
                variant="outlined"
                type="number"
                size="small"
                id="tagCoordinateN"
                name="tagCoordinateN"
                className="form-control"
                onChange={handleTags}
              />
              </div>
              <div className="col-sm">
              <label htmlFor="coordinates">East</label>
                <input
                variant="outlined"
                type="number"
                size="small"
                id="tagCoordinateE"
                name="tagCoordinateE"
                className="form-control"
                onChange={handleTags}
              />
              </div>
              </div>
              <button
                type="button"
                variant="contained"
                className="btn btn-success update add-new-tag"
                onClick={e => {
                  addLocationTag(e);
                }}
              >
                Luo uusi tunniste
                </button>
            </div>
          </div>
          <div className="col-sm">
            <div className="form-group">
              <h5>Luodut tunnisteet</h5>
              <hr />
       <div id="scroll-table">
         <table id="created-tags" className="table">
  <tbody>
                {locations &&
                  locations.map((locationTag, index) => (

    <tr key={index} value={locationTag.id}>
      <td className="tagName">{locationTag.tagName} </td>
      <td className="edit"><Link to={"/tagedit/" + locationTag.id}>Muokkaa</Link></td>
    </tr>   
                  ))}
            </tbody>
</table></div>

            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <div className="form-group">
              <h5>Yhdistä tunniste ja paikka:</h5>
              <hr />
              <div className="row">
                <div className="col-sm">
                  <h6>1. Valitse tunniste:</h6>
                  <select id="selectTagtoAdd" name="selectTagtoAdd" onChange={handleTagSelection}>
                  <option key="0">Valitse tunniste</option>
                    {locations &&
                      locations.map((locationTag, index) => (
                        <option key={index} value={locationTag.id}>{locationTag.tagName} ({locationTag.id})</option>
                      ))}
                  </select>
                  <br />
                  <p><small>Valittu tunnisteen ID: {selectedLocationTags.id}</small></p>
                </div>
                <div className="col-sm">
                <h6>2. Valitse paikka</h6>
                  <select id="selectArticle" name="selectArticle" onChange={handlePostSelection}>
                  <option key="0">Valitse paikka</option>
                    {locationList &&
                      locationList.map((locationList, index) => (
                        <option key={index} value={locationList.id}>{locationList.title} ({locationList.id})</option>
                      ))}
                  </select>
                  <br />
                  <p><small>Valittun paikan ID: {selectedLocationPost.id}</small></p>
                </div>
              </div>
              <div className="row">           
              <div className="col-sm">   
              <h6>3. Liitä tunniste ja postaus yhteen</h6>
              <button
                type="submit"
                variant="contained"
        
                className="btn btn-success update"
                onClick={e => {
                  addLocationTagToArticle(e);
                }}
              >
                Yhdistä
              </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LocationsTagList;
