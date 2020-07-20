import React from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
// import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '3d5766ea86654ee19e5732f5ec740aa6'
});

const particlesOptions = {
  particles: {
    number:{
      value:110,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    console.log("hello");
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then((response) => this.displayFaceBox(this.calculateFaceLocation(response))
    .catch(err => console.log(err))
    );
  }

  onRouteChange = (route) => {
    if(route === 'home'){
      this.setState({isSignedIn: true});
    }else if(route === 'signin'){
      this.setState({isSignedIn: false});
    }

    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles 
            className="particles"
            params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />

        { 
          this.state.route === 'home' ? 
          <>
            <Logo />
            {/* <Rank /> */}
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </>
            : 
            (this.state.route === 'signin') ?
          <SignIn onRouteChange={this.onRouteChange} />
              :
          <Register onRouteChange={this.onRouteChange} />
        }
      </div>
    );
  }
}

export default App;
