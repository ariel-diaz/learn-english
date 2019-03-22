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
    const [lista, setLista] = useState([]);
    const [actualWord, setActualWord] = useState({});
    const [puntos, setPuntos] = useState(0); 
    const [listaCorrectas, setListaCorrectas] = useState([]);
    const [listaIncorrectas, setListaIncorrectas] = useState([]);
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
        setLista(data);
        setActualWord(getWord(data));
    }

    const next = (e) => {
        e.preventDefault()
        if(isCorrecta()) {
            setPuntos(puntos + 1);
            const clone = listaCorrectas.slice();
            const newList = clone.concat(actualWord.spanish);
            setListaCorrectas(newList);
            setInputResponse('');
        } else {
            setPuntos(puntos - 1);
            const clone = listaIncorrectas.slice();
            const newList = clone.concat(`${actualWord.spanish} -> ${actualWord.english}`);
            setListaIncorrectas(newList);
            setInputResponse('');
        }
    
        setActualWord(getWord(lista));
    }

    const isCorrecta = () =>  actualWord.english.trim().toLowerCase() === inputResponse.trim().toLowerCase();

    const handleChangeResponse = (e) => {
        setInputResponse(e.target.value);
    }

    useEffect( () => {
        getList();
    },[])

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
                listaCorrectas.map(x => <li> {x} </li>)
                : "NO HAY CORRECTAS" }
            </ol>

            <hr/>

            
            <ol>
                <h3>  INCORRECTAS </h3> 
                {listaIncorrectas.length > 0 ?
                listaIncorrectas.map(x => <li> {x} </li>)
                : "NO HAY CORRECTAS" }
            </ol>
        </div>
    )

}


export default Container;