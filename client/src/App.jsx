import { Fragment, useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';


function App() {
  const [file, setFile] = useState(null);
  const [imageList, setImageList] = useState([])
  const [message, setMessage] = useState('');
  const [listUpdated, setListUpdated] = useState(false)

  const [currentImage, setCurrentImage] = useState(null)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {

    Modal.setAppElement('body')

    fetch('http://192.168.1.5:9000/images/get')
    .then(res => res.json())
    .then(res => setImageList(res))
    .catch(err => {
      console.error(err)
    })
    setListUpdated(false)
  }, [listUpdated])

  const selectedHandler = e => {
    setFile(e.target.files[0]);
  };

  const sendHandler = () => {
    if (!file) {
      alert("Carga un archivo");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://192.168.1.5:9000/images/post', {
      method: 'POST',
      body: formData
    })
      .then(res => res.text())
      .then(res => {
        console.log(res);
        setMessage('Archivo subido exitosamente');
        setListUpdated(true)
      })
      .catch(err => {
        console.error(err);
        setMessage('Error al subir el archivo');
      });

    document.getElementById('fileinput').value = null;
    setFile(null);
  };

  const modalHandler = (isOpen, image) => {
    setModalIsOpen(isOpen)
    setCurrentImage(image)
  }

  const deleteHandler = () => {
    let imageID = currentImage.split('-')
    console.log(imageID[0])
    imageID = parseInt(imageID[0])
    fetch('http://192.168.1.5:9000/images/delete/' + imageID, {
      method: 'DELETE'
    })
    .then(res => res.text())
    .then(res => console.log(res))

    setModalIsOpen(false)
    setListUpdated(true)
  }

  return (
    <Fragment>
      <nav className='navbar navbar-dark bg-dark'>
        <div className='container'>
          <a href="#!" className='navbar-brand'>Imagenes</a>
        </div>
      </nav>
      <div className='container mt-5'>
        <div className='card'>
          <div className='row'>
            <div className='col-10'>
              <input id='fileinput' onChange={selectedHandler} className='form-control' type="file" />
            </div>
            <div className='col-2'>
              <button onClick={sendHandler} type='button' className='btn btn-danger'>Cargar</button>
            </div>
          </div>
        </div>
        {message && <div className='alert alert-info mt-3'>{message}</div>}
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React: Joan D</h1>

      <div className='container mt-3' style={{display: "flex", flexWrap: "wrap"}}>
        {imageList.map(image => (
        <div key={image} className='card'>
          <img className='card-img-top' src={'http://192.168.1.5:9000/' + image} alt="..." style={{width: "200px"}} />
          <div className='card-body'>
            <button onClick={() => modalHandler(true, image)} className='btn btn-danger'>Ver</button>
          </div>
        </div>
        ))}
      </div>

      <Modal style={{content: {right: "20%", left: "20%"}}} isOpen={modalIsOpen} onRequestClose={() => modalHandler(false, null)}>
        <div className='card'>
          <img src={'http://192.168.1.5:9000/' + currentImage} alt="..." />
          <div className='card-body'>
            <button onClick={() => deleteHandler()} className='btn btn-danger'>Eliminar</button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default App;
