import './App.css';
import React, { useState } from 'react';

import { faDog, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dogMessageInterface from './interfaces/dogMessageInterface';
import ReactLoading from 'react-loading';

function App() {

  const [inputContent, setInputContent] = useState<string | undefined>(undefined)
  const [imageString, setImageString] = useState<string | undefined>(undefined)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isBreedSuccessful, setIsBreedSuccessfull] = useState<boolean | undefined>(undefined)

  const fetchData = async () => {
    setIsFetching(true)
    await fetch(`https://dog.ceo/api/breed/${inputContent}/images/random`).then((res: any) => res.json().then((response: dogMessageInterface) => {
      setImageString(response.message)
      setIsBreedSuccessfull(response.status === "success")
      setIsFetching(false)
    }))
  }

  return (
    <>
      <div className='screen'>
        <section className='container'>
          <img src="https://logomakercdn.truic.com/ux-flow/industry/dog-breeding-meta.png" alt="" className='dog' />
          <div className='input-div'>
            <FontAwesomeIcon icon={faDog} className='dog-fa' />
            <input type="text" placeholder='Enter the breed!' onChange={(e) => setInputContent(e.target.value)} />
            <button className='button-glass' onClick={fetchData}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          {
            isFetching ? (
              <div className='image-div'>
                <ReactLoading type={"spin"} color={"#ff82aa"} height={'160px'} width={'160px'} />
              </div>
            )
              :
              imageString !== undefined && (
                <div className='image-div'>
                  {
                    isBreedSuccessful
                      ?
                      <img src={imageString} alt="dog" />
                      :
                      <>
                      <div className='not-found-div'>
                      <img src="https://fresh4pet.com.br/wp-content/uploads/2023/02/foto-blog-10-fevereiro-1024x672.jpg" alt="" />
                      <p>Raça não encontrata!</p>
                      </div></>
                  }
                </div>
              )
          }
        </section>
      </div>
    </>
  );
}

export default App;
