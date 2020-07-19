import React, {useState} from 'react';
import LocationDataService from '../services/LocationService';
import TextareaAutosize from 'react-textarea-autosize';
import {toast} from 'react-toastify';
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet';
import {icon as leafletIcon} from 'leaflet';
import HappyRobot from '../resources/happyrobot.gif';
import LocationPicker from 'react-leaflet-location-picker';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

toast.configure ({
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

const AddLocation = props => {
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
  };
  const [location, setLocation] = useState (initialLocationState);
  const [submitted, setSubmitted] = useState (false);

  const handleInputChange = event => {
    const {name, value} = event.target;
    setLocation ({...location, [name]: value});
  };

  const saveLocation = () => {
    var data = {
      title: location.title,
      description: location.description,
      coordinateN: location.coordinateN,
      coordinateE: location.coordinateE,
      markedImportant: location.markedImportant,
      videoEmbed: location.videoEmbed,
      url: location.url,
      flickrTag: location.flickrTag,
      flickrMore: location.flickrMore,
      featuredImage: location.featuredImage,
    };

    LocationDataService.create (data)
      .then (response => {
        setLocation ({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          markedImportant: response.data.markedImportant,
          coordinateN: response.data.coordinateN,
          coordinateE: response.data.coordinateE,
          videoEmbed: response.data.videoEmbed,
          url: response.data.url,
          flickrTag: response.data.flickrTag,
          flickrMore: response.data.flickrMore,
          featuredImage: response.data.featuredImage,
        });

        setSubmitted (true);
        toast ('Paikka lisätty tietokantaan!');
        console.log (response.data);
      })
      .catch (e => {
        toast (
          'Virhe! :( Ole hyvä ja tarkista ilmoittamasi tiedot kertaalleen.'
        );
        console.log (e);
      });
  };

  const newLocation = () => {
    setLocation (initialLocationState);
    setSubmitted (false);
  };

  const getBaseUrl = e => {
    let file = document.querySelector ('input[type=file]')['files'][0];
    let reader = new FileReader ();
    let baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      console.log (baseString);
      setLocation ({...location, featuredImage: baseString});
    };
    reader.readAsDataURL (file);
  };

  function clear (e) {
    e.preventDefault ();
    setLocation ({...location, featuredImage: ''});
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

const pointVals = [[location.coordinateN, location.coordinateE]];

const pointMode = {
    center: [62.4717, 26.2793],
    banner: false,
    control: {
      values: pointVals,
      onClick: point =>
        console.log ("I've just been clicked on the map!", point) +
        setLocation ({
          ...location,
          coordinateN: point.slice (0, 1).toString (),
          coordinateE: point.slice (1, 2).toString (),
        }),
      onRemove: point =>
        console.log ("I've just been clicked for removal :(", point),
    },
  };

  return (
    <div id="page" className="addlocation">
      {submitted
        ? <div className="innercontainer text-center">
            <h4 style={{marginTop: '40px'}}>
              <a href={'https://paikkatietokanta.net/view/' + location.id}>
                {location.title}
              </a> lisätty!
            </h4>
            <p>
              <p>
                <img
                  src={HappyRobot}
                  style={{
                    width: '200px',
                    marginTop: '20px',
                    marginBottom: '20px',
                  }}
                  alt="Diver"
                />
              </p>
            </p>
            <button
              type="button"
              className="btn btn-success"
              onClick={newLocation}
            >
              Lisää uusi paikka?
            </button>
          </div>
        : <form name="add-locaiton">
            <div className="innerwidth">
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

                <h3>Lisää paikka</h3>
                <p>
                  Punaisella merkityt
                  <span className="required">*</span>
                  -kohdat ovat pakollisia täyttää.
                </p>
              </div>
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
                        value={location.title}
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
                        value={location.description}
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
                        value={location.url}
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
                      value={location.videoEmbed}
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
                      value={location.featuredImage}
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
                      value={location.flickrTag}
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
                      value={location.flickrMore}
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
                        <a href="https://www.google.fi/maps">Google Mapsia.</a>
                      </small>
                    </p>
                    <div className="row coordinates">
                      <div className="col-sm">
                        <label>North</label>
                        <input
                          type="number"
                          className="form-control"
                          id="coordinateN"
                          value={location.coordinateN}
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
                          value={location.coordinateE}
                          onChange={handleInputChange}
                          name="coordinateE"
                          required
                        />
                      </div>
                    </div>
                    <label>Esikatselu</label>
                    <LeafletMap
                      center={[location.coordinateN, location.coordinateE]}
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
                          location.markedImportant
                            ? importantMarkerIcon
                            : customMarkerIcon
                        }
                        position={[location.coordinateN, location.coordinateE]}
                      >
                        <Popup>
                          {location.title}
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
              <div className="form-group subdetails published">
                  <div className="row">
                  <div className="col-sm-4">
                      <label>Julkaisun tila:</label>
                    </div>
                <div className="col-sm-3 import">
                      <label htmlFor="published">Luonnos</label>
                      <input
                        type="radio"
                        className="form-control"
                        id="published_no"
                        value="false"
                        onChange={handleInputChange}
                        name="published"
                      />
                    </div>
                    <div className="col-sm">
                      <label htmlFor="not-published">Julkaistu</label>
                      <input
                        type="radio"
                        className="form-control"
                        id="published_yes"
                        value="true"
                        onChange={handleInputChange}
                        name="published"
                      />
                    </div> </div></div>
                <div className="form-group subdetails important">
                  <div className="row">
        
                    <div className="col-sm-4">
                      <label>Tärkeysaste</label>
                    </div>
                    <div className="col-sm-3 import">
                      <label htmlFor="important">Tärkeä</label>
                      <input
                        type="radio"
                        className="form-control"
                        id="markedImportant_yes"
                        value="true"
                        onChange={handleInputChange}
                        name="markedImportant"
                      />
                    </div>
                    <div className="col-sm">
                      <label htmlFor="not-important">Ei-tärkeä</label>
                      <input
                        type="radio"
                        className="form-control"
                        id="markedImportant_no"
                        value="false"
                        onChange={handleInputChange}
                        name="markedImportant"
                      />
                    </div>
         
                  </div></div>
                  <div className="form-group subdetails">
                  <div className="row">
                <div className="col-sm">

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={e => {
                      if (
                        window.confirm ('Haluatko lisätä paikan tietokantaan?')
                      )
                        saveLocation (e);
                    }}
                  >
                    Tallenna
                  </button>
                </div>   </div>
              </div>
            </div>
          </form>}
    </div>
  );
};
export default AddLocation;
