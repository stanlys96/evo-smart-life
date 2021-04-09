import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import { Switch, Route, BrowserRouter as Router, } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
