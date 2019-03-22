import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import Lista from './components/lista';


const Title = styled.div`
  font-weight: 600;
  font-size: 3em;
`;

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


class App extends Component {
  render() {
    return (
      <Main>
        <Title>
            Learn English!   
        </Title>

        <hr />
        <Lista />
      </Main>

    );
  }
}

export default App;
