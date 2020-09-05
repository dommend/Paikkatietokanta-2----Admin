import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { Preloader, Placeholder } from 'react-preloading-screen';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Dashboard from './components/Dashboard';
import AddLocation from "./components/AddLocation";
import LocationEdit from "./components/LocationEdit";
import NotFoundPage from './components/NotFoundPage';
import TagControlPage from './components/TagControl';
import TagEditPage from './components/TagEdit';
import Search from './components/Search';

function App() {

  return (
    <Router>
      <Navbar expand="md" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto navbar-nav">
            <ul>
            <li className="nav-item">
                <a href="https://paikkatietokanta.net/" className="nav-link back-to-client">
                <span className="material-icons">chevron_left</span>
              </a >
            </li>
            <li className="nav-item">
                <NavLink to={"/dashboard"} className="nav-link frontpage" activeClassName="active">
                <span className="material-icons">dashboard</span> Dashboard
              </NavLink >
            </li>
            <li className="nav-item">
                <NavLink to={"/add"} className="nav-link add-new" activeClassName="active">
                <span className="material-icons">add_box</span> Lisää uusi
              </NavLink >
              </li>

            <li className="nav-item">
                <NavLink to={"/tagmanagement"} className="nav-link add-new" activeClassName="active">
                <span className="material-icons">add_box</span> Avainsanojen hallinta
              </NavLink >
              </li>
         
              <li className="nav-item">
                <NavLink to={"/search"} className="nav-link" activeClassName="active">
                <span className="material-icons">search</span> Etsi
              </NavLink >
              </li>
            </ul>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <main>
        { /* Switch / Route */}
        <Switch>
          <Redirect exact from="/" to="/dashboard" />
          <Route exact path={["/", "/dashboard"]} component={Dashboard} />
          <Route exact path="/add" component={AddLocation} />
          <Route exact path="/edit/:id" component={LocationEdit} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/tagmanagement" component={TagControlPage} />
          <Route exact path="/tagedit/:id" component={TagEditPage} />

          { /* 404-sivu */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Preloader>
        <Placeholder>
          <pre>{`
                     ₕₑₗₗₒ    ±
                          [ºuº]
                         └|___|┐
                           ┘ └
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                   

  Please wait... 
  Mr. Happy Robot is currently loading the database...

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}</pre>
        </Placeholder>
      </Preloader>

    </Router>
  );
}
export default App;
