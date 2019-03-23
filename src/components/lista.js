import React, {useState, useEffect} from 'react'
import styled from 'styled-components';


const ListContainer = styled.div`
    display:flex;
    justify-content: center;
    flex-direction:row;
`;

const Puntos = styled.span`
background-color: #009688;
padding: 10px 20px;
font-size: 35px;
border-radius: 50%;
border: 3px solid #8e9295;
margin: 20px;
text-align: center;
color: #fff;
font-weight: 600;
    `;

const InputAnswer = styled.input`
    height: 50px;
    font-size: 24px;
`;


const Button = styled.button`
    background-color: #009688;
    border: none;
    padding: 20px;
    margin: 20px;
    color: #fff;
    font-weight: 600;
    border-radius: 4px;
    cursor:pointer;
`;

const AlertaMensaje = styled.span`
    font-weight: 600;
    color: green;
    font-size: 24px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-center: center;
`;

const ButtonContainer = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`


const Container = () => {

    const initialPuntos = JSON.parse(localStorage.getItem('initialPuntos')) || 0;
    const initialCorrectas = JSON.parse(localStorage.getItem('initialCorrectas')) || [];
    const initialIncorrectas = JSON.parse(localStorage.getItem('initialIncorrectas')) || [];

    const [lista, setLista] = useState([]);
    const [actualWord, setActualWord] = useState({});
    const [puntos, setPuntos] = useState(initialPuntos); 
    const [listaCorrectas, setListaCorrectas] = useState(initialCorrectas);
    const [listaIncorrectas, setListaIncorrectas] = useState(initialIncorrectas);
    const [inputResponse, setInputResponse] = useState('');
    const [mensaje, setMensaje] = useState('');

    const getWord = arr => arr[Math.floor(Math.random() * arr.length)]
    const getList = async () => {
        const res = await fetch('https://english-pwa.firebaseio.com/lista.json',
         {
            method: 'GET',
            headers: {
               'Access-Control-Allow-Origin': '*',
            }
        });
        const data = await res.json();
        const correctasMap = initialCorrectas.map(x => x.english.toLowerCase().trim());
        const newData =  data.filter( x => !correctasMap.includes(x.english.toLowerCase().trim()));
        
        setLista(newData);
        setActualWord(getWord(data));
        console.log(newData);
    };

    const next = (e) => {
        e.preventDefault()
        if(isCorrecta()) {
            setPuntos(puntos + 1);
            const clone = listaCorrectas.slice();
            const newList = clone.concat(actualWord);
            setListaCorrectas(newList);
            setInputResponse('');

            setMensaje('RESPUESTA CORRECTA!');
        } else {
            setPuntos(puntos - 1);
            const clone = listaIncorrectas.slice();
            const newList = clone.concat(actualWord);
            setListaIncorrectas(newList);
            setMensaje(`Respuesta correcta: ${actualWord.english}`);
            setInputResponse('');

        }

        
        setTimeout(() => {
            setMensaje('');
            setActualWord(getWord(lista));
        }, 1000)
        
    

    }

    const isCorrecta = () =>  actualWord.english.trim().toLowerCase() === inputResponse.trim().toLowerCase();

    const handleChangeResponse = (e) => {
        setInputResponse(e.target.value);
    }

    const cleanIncorrectas = () => {
        localStorage.setItem('initialIncorrectas', JSON.stringify([]));
        setListaIncorrectas([]);
    }

    useEffect( () => {
        getList();
    },[])




    useEffect( () => {
        localStorage.setItem('initialPuntos', puntos);
        localStorage.setItem('initialCorrectas', JSON.stringify(listaCorrectas));
        localStorage.setItem('initialIncorrectas', JSON.stringify(listaIncorrectas));

    });

    return (
        <>
         <Puntos>   {puntos} </Puntos>
           {lista.length > 0 ? 
            <h3> <b>{actualWord.spanish} </b>
            </h3>
            : <h3> No hay palabras </h3>}

         <AlertaMensaje> {mensaje}</AlertaMensaje>

            <Form onSubmit={next}>        
            <InputAnswer type="text" value={inputResponse} onChange={handleChangeResponse}/>
              
              <ButtonContainer>
              <Button onClick={next}>
                NEXT
                </Button>
                <strong> or enter </strong>
            </ButtonContainer>
            </Form>
            <Button onClick={() => cleanIncorrectas()}> limpiar incorrectas </Button> 
            <hr />
            <ListContainer>
                
            <ol>
                <h3>  CORRECTAS ({listaCorrectas.length})</h3> 
                {listaCorrectas.length > 0 ?
                listaCorrectas.map((x, i) => <li key={i}> {x.english} </li>)
                : "NO HAY CORRECTAS" }
            </ol>

            <ol>
            <h3>  INCORRECTAS ({listaIncorrectas.length})             </h3>        
                {listaIncorrectas.length > 0 ?
                listaIncorrectas.map((x, i) => <li key={i}> {x.spanish} -> Correcta: {x.english} </li>)
                : "NO HAY CORRECTAS" }
            </ol>
            </ListContainer>
        </>
    )

}


export default Container;