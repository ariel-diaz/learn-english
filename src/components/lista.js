import React, {useState, useEffect} from 'react'



// const useLista = () => {
//  const [lista, setLista] = useState([]);

//     const getList = async () => {
//         const res = await fetch('https://english-pwa.firebaseio.com/lista.json',
//          {
//             method: 'GET',
//             headers: {
//                'Access-Control-Allow-Origin': '*',
//             }
//         });
//         const data = await res.json();
//         setLista(data);
//     }


//     useEffect( () => {
//         getList();
//     }, []);

//     return lista;

// }

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

        console.log(data);
        setLista(data);
        setActualWord(getWord(data));
    }

    const next = (e) => {
        e.preventDefault()
        if(isCorrecta()) {
            setPuntos(puntos + 1);
            const clone = listaCorrectas.slice();
            const newList = clone.concat(actualWord);
            setListaCorrectas(newList);
            setInputResponse('');
        } else {
            setPuntos(puntos - 1);
            const clone = listaIncorrectas.slice();
            const newList = clone.concat(actualWord);
            setListaIncorrectas(newList);
            setInputResponse('');
        }
    
        setActualWord(getWord(lista));
    }

    const isCorrecta = () =>  actualWord.english.trim().toLowerCase() === inputResponse.trim().toLowerCase();

    const handleChangeResponse = (e) => {
        setInputResponse(e.target.value);
    }

    const cleanIncorrectas = () => {
        localStorage.setItem('initialIncorrectas', JSON.stringify([]));
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
        <div>
            <div> TU PUNTAJE ES: {puntos} </div>

           {lista.length > 0 ? 
            <h3> <b>{actualWord.spanish} </b>
            </h3>
            
            : <h3> No hay palabras </h3>}


            <form onSubmit={next}>
            
                <input type="text" value={inputResponse} onChange={handleChangeResponse} />
                <button onClick={next}>
                NEXT
                </button>
            </form>

            <hr />

            <ol>
                <h3>  CORRECTAS </h3> 
                {listaCorrectas.length > 0 ?
                listaCorrectas.map((x, i) => <li key={i}> {x.english} </li>)
                : "NO HAY CORRECTAS" }
            </ol>

            <hr/>

            
            <ol>
                <h3>  INCORRECTAS </h3> 
                <button onClick={cleanIncorrectas()}> limpiar incorrectas </button>
                {listaIncorrectas.length > 0 ?
                listaIncorrectas.map((x, i) => <li key={i}> {x.spanish} </li>)
                : "NO HAY CORRECTAS" }
            </ol>
        </div>
    )

}


export default Container;