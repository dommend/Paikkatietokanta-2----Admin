import React, {useState, useEffect} from 'react';
import LocationDataService from '../services/LocationService';
import TextareaAutosize from 'react-textarea-autosize';
import {toast} from 'react-toastify';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import LocationPicker from 'react-leaflet-location-picker';
import {icon as leafletIcon} from 'leaflet';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom';

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
    title: '',
    description: '',
    markedImportant: false,
    coordinateN: '',
    coordinateE: '',
    videoEmbed: '',
    url: '',
    flickrTag: '',
    flickrMore: '',
    featuredImage: '',
    published: true,
  };

  const [currentLocation, setCurrentLocation] = useState (initialLocationState);
  const [locationTags, setLocationTags] = useState([]);


  const getLocation = id => {
    LocationDataService.get (id)
      .then (response => {
        setCurrentLocation (response.data);
        setLocationTags(response.data.tags);
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  useEffect (
    () => {
      getLocation (props.match.params.id);
    },
    [props.match.params.id]
  );

  const handleInputChange = event => {
    const {name, value} = event.target;
    setCurrentLocation ({...currentLocation, [name]: value});
  };

  const updateLocation = () => {
    LocationDataService.update (currentLocation.id, currentLocation)
      .then (response => {
        toast ('Päivitetty');
        console.log (response.data);
      })
      .catch (e => {
        console.log (e);
      });
  };

  const deleteLocation = () => {
    LocationDataService.remove (currentLocation.id)
      .then (response => {
        toast ('Paikka poistettu');
        console.log (response.data);
        props.history.push ('/dashboard');
      })
      .catch (e => {
        console.log (e);
      });
  };

  const getBaseUrl = e => {
    let file = document.querySelector ('input[type=file]')['files'][0];
    let reader = new FileReader ();
    let baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      console.log (baseString);
      setCurrentLocation ({...currentLocation, featuredImage: baseString});
    };
    reader.readAsDataURL (file);
  };

  function clear (e) {
    e.preventDefault ();
    setCurrentLocation ({...currentLocation, featuredImage: ''});
    document.getElementById ('base64').value = '';
  }

  const customMarkerIcon = leafletIcon ({
    iconUrl: require ('../resources/marker.png'),
    shadowUrl: require ('../resources/marker-shadow.png'),
    iconSize: [29, 39],
    shadowSize: [26, 16],
    shadowAnchor: [12, -12],
    popupAnchor: [0, -10],
  });

  const importantMarkerIcon = leafletIcon ({
    iconUrl: require ('../resources/marker-important.png'),
    shadowUrl: require ('../resources/marker-shadow.png'),
    iconSize: [26, 36],
    shadowSize: [26, 16],
    shadowAnchor: [12, -12],
  });

  const pointVals = [
    [currentLocation.coordinateN, currentLocation.coordinateE],
  ];


  const removeTag = (e) => {
    const tagID = e.target.value;
    LocationDataService.removeTagFromArticle(tagID, { data: currentLocation.id })
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const pointMode = {
    banner: false,
    control: {
      values: pointVals,
      onClick: point =>
        console.log ("I've just been clicked on the map!", point) +
        setCurrentLocation ({
          ...currentLocation,
          coordinateN: point.slice (0, 1).toString (),
          coordinateE: point.slice (1, 2).toString (),
        }),
      onRemove: point =>
        console.log ("I've just been clicked for removal :(", point),
    }
  };

  return (
    <div id="page" className="editlocation">
      {currentLocation
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

              {currentLocation.published
                ? <h4 className="green">Julkaistu</h4>
                : <h4 className="red">Luonnos</h4>}
              <h3>Muokkaa '{currentLocation.title}' sijaintia</h3>
              <p>
                <small>
                  <a
                    href={
                      'https://paikkatietokanta.net/view/' + currentLocation.id
                    }
                  >
                    https://paikkatietokanta.net/view/{currentLocation.id}
                  </a>
                </small>
              </p>
              <p>
                Punaisella merkityt
                <span className="required">*</span>
                -kohdat ovat pakollisia täyttää.
              </p>
            </div>
            <form name="add-locaiton">
              <div className="innerwidth">
                <div className="row">
                  <div className="col-sm">
                    <div>
                      <div className="form-group together">
                        <h5>Perustiedot</h5>
                        <hr />
                        <label htmlFor="title">
                          Otsikko<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          value={currentLocation.title}
                          onChange={handleInputChange}
                          name="title"
                          required
                        />
                        <label htmlFor="description">
                          Kuvaus
                        </label>
                        <TextareaAutosize
                          className="form-control"
                          id="description"
                          value={currentLocation.description}
                          onChange={handleInputChange}
                          name="description"
                        />
                      </div>
                      <div className="form-group">
                        <h5>Lisää linkki ulos</h5>
                        <hr />
                        <label htmlFor="description">URL-osoite</label>
                        <TextareaAutosize
                          type="text"
                          className="form-control"
                          id="url"
                          value={currentLocation.url}
                          onChange={handleInputChange}
                          name="url"
                        />
                      </div>

                      <div className="form-group">
                        <h5>
                          <span role="img" aria-label="skull">💀</span>
                          {' '}
                          Muunna kuva BASE64-muotoon
                          {' '}
                          <span role="img" aria-label="skull">💀</span>
                        </h5>
                        <hr />
                        <p>
                          <small>
                            <strong>
                              Huom. käytä tätä vain äärimmäisessä hädässä!
                            </strong>
                            {' '}
                            Tekee tietokannasta maailman painavimman materiaalin. Korvaa pääkuvan upotteen.
                          </small>
                        </p>
                        <input id="base64" type="file" onChange={getBaseUrl} />
                        <button className="clear" onClick={clear}>
                          Tyhjennä kuvavalinnat
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="form-group">
                      <h5>Upota videotiedosto</h5>
                      <hr />
                      <p>
                        <small>
                          Huom! Älä käytä upotus-koodia,
                          {' '}
                          <span className="required">pelkkä URL-osoite</span>
                          {' '}
                          riittää.
                        </small>
                      </p>

                      <input
                        type="text"
                        className="form-control"
                        id="videoEmbed"
                        value={currentLocation.videoEmbed}
                        onChange={handleInputChange}
                        name="videoEmbed"
                      />
                      <p>
                        <small className="even-smaller">
                          Tuetut palvelut: Youtube, Facebook, Soundblouc, Streamable videos use Player.js, Vimeo, Wistia, Twitch, Dailymotion, Vidyard.
                        </small>
                      </p>
                    </div>
                    <div className="form-group">
                      <h5>Hae tiedot Flickristä</h5>
                      <hr />
                      <label htmlFor="img-url">
                        Liitä pääkuvana käytettävän kuvan URL-osoite
                      </label>
                      {' '}
                      <br />
                      <small>
                        Osoite on muotoa
                        {' '}
                        <code>
                          https://live.staticflickr.com/65535/49947938748_55abc5c79f_h.jpg
                        </code>
                      </small>
                      <input
                        id="featuredImage"
                        className="form-control"
                        name="featuredImage"
                        value={currentLocation.featuredImage}
                        onChange={handleInputChange}
                      />
                      <label>Avainsana</label> <br />
                      <small>
                        Syöttämällä avainsanan voit hakea vastaavat kuvat.
                      </small>
                      <input
                        type="text"
                        className="form-control"
                        id="flickrTag"
                        value={currentLocation.flickrTag}
                        onChange={handleInputChange}
                        name="flickrTag"
                      />
                      <label>
                        Linkki
                      </label>
                      <p>
                        <small>
                          Lisää linkki albumiin, kuvaan tai avainsanaan.
                        </small>
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        id="flickrMore"
                        value={currentLocation.flickrMore}
                        onChange={handleInputChange}
                        name="flickrMore"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group subdetails coordinatedetails">
                  <h5>Paikkatiedot</h5>
                  <hr />
                  <div className="row">
                    <div className="col-sm preview">

                      <label htmlFor="coordinates">
                        Koordinaatit (N ja E)<span className="required">*</span>
                      </label>
                      <p>
                        <small>
                          Ilmoita koordinaatit muodossa:
                          {' '}
                          <code>62,603063</code>
                          {' '}
                          ja
                          {' '}
                          <code>29,754834</code>
                          .
                          Voit syöttää koordinaatit joko käsin, etsiä paikkaa viereiseltä kartalta tai käyttää
                          {' '}
                          <a href="https://www.google.fi/maps">
                            Google Mapsia.
                          </a>
                        </small>
                      </p>
                      <div className="row coordinates">
                        <div className="col-sm">
                          <label>North</label>
                          <input
                            type="number"
                            className="form-control"
                            id="coordinateN"
                            value={currentLocation.coordinateN}
                            onChange={handleInputChange}
                            name="coordinateN"
                            required
                          />
                        </div>
                        <div className="col-sm">
                          <label>East</label>
                          <input
                            type="number"
                            className="form-control"
                            id="coordinateE"
                            value={currentLocation.coordinateE}
                            onChange={handleInputChange}
                            name="coordinateE"
                            required
                          />
                        </div>
                      </div>
                      <label>Esikatselu</label>
                      <LeafletMap
                        center={[
                          currentLocation.coordinateN,
                          currentLocation.coordinateE,
                        ]}
                        zoom={15}
                        maxZoom={20}
                        attributionControl={true}
                        zoomControl={false}
                        doubleClickZoom={true}
                        scrollWheelZoom={true}
                        dragging={true}
                        animate={true}
                        easeLinearity={0.35}
                      >
                        <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
                        <Marker
                          icon={
                            currentLocation.markedImportant
                              ? importantMarkerIcon
                              : customMarkerIcon
                          }
                          position={[
                            currentLocation.coordinateN,
                            currentLocation.coordinateE,
                          ]}
                        >
                          <Popup>
                            {currentLocation.title}
                          </Popup>
                        </Marker>
                      </LeafletMap>
                    </div>
                    <div className="col-sm-8 pick-a-location">
                      <LocationPicker
                        pointMode={pointMode}
                        showInputs={false}
                        geoserver={true}
                        geoURL="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                      />
                    </div>
                  </div>
                </div>

              <div className="form-group subdetails important">
                <div className="row">
                  
                    {locationTags &&
                      locationTags.map((locationTag, index) => (
                      <ul id="taglist">
                        <li key={index} className="tag"><Link to={"/tagedit/" + locationTag.id}>{locationTag.tagName}</Link>

                          <button type="submit" className="removetag" value={locationTag.id} onClick={e => {
                            removeTag(e);
                          }}
                          >
                            X
                  </button>

                        </li>
                      </ul> 
                      ))}
                 
                </div>
                </div>

                <div className="form-group subdetails important">
                  <div className="row">

                    <div className="col-sm">
                      <label>Tärkeysaste: </label>
                      {currentLocation.markedImportant
                        ? <span className="green">
                            {' '}<small><strong>Tärkeä</strong></small>
                          </span>
                        : <span className="red">
                            {' '}<small><strong>Ei-tärkeä</strong></small>
                          </span>}

                      {currentLocation.markedImportant
                        ? <select
                            className="form-control"
                            name="markedImportant"
                            onChange={handleInputChange}
                          >
                            <option value="true">Tärkeä</option>
                            <option value="false">Ei-tärkeä</option>
                          </select>
                        : <select
                            className="form-control"
                            name="markedImportant"
                            onChange={handleInputChange}
                          >
                            <option value="false">Ei-tärkeä</option>
                            <option value="true">Tärkeä</option>

                          </select>}
                    </div>
                    <div className="col-sm import">

                      <label>Julkaisun tila:</label>
                      {currentLocation.published
                        ? <span className="green">
                            {' '} <small><strong>Julkaistu</strong></small>
                          </span>
                        : <span className="red">
                            {' '} <small><strong>Luonnos</strong></small>
                          </span>}

                      {currentLocation.markedImportant
                        ? <select
                            className="form-control"
                            name="published"
                            onChange={handleInputChange}
                          >
                            <option value="true">Julkaistu</option>
                            <option value="false">Luonnos</option>
                          </select>
                        : <select
                            className="form-control"
                            name="published"
                            onChange={handleInputChange}
                          >
                            <option value="false">Luonnos</option>
                            <option value="true">Julkaistu</option>

                          </select>}

                    </div>

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
                              'Haluatko varmasti poistaa kohteen?'
                            )
                          )
                            deleteLocation (e);
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
                          if (window.confirm ('Haluatko päivittää sijainnin?'))
                            updateLocation (e);
                        }}
                      >
                        Päivitä
                      </button>
                    </div>{' '}
                  </div>
                </div>
              </div>
            </form>
          </div>
        : <div className="innerwidth text-center">
            <br />
            <p>Paikka poistettu kannasta.</p>
            <p><a href="./">Palaa etusivulle.</a></p>
          </div>}
    </div>
  );
};
export default Location;
