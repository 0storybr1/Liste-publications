import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFiltredPosts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [detailPost, setDetailPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(result => {
        setPosts(result.data);
        setFiltredPosts(result.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    if (searchId === '') {
      setFiltredPosts(posts);
    } else {
      const filtred = posts.filter(post => post.id === parseInt(searchId));
      setFiltredPosts(filtred);
    }
  };

  const viewDetailPost = async (postId) => {
    try {
      const result = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setDetailPost(result.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailPost(null);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setDetailPost((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    setPosts((prevPosts) =>
      prevPosts.map(post => post.id === detailPost.id ? detailPost : post)
    );
    setFiltredPosts((prevPosts) =>
      prevPosts.map(post => post.id === detailPost.id ? detailPost : post)
    );
    setIsEditing(false); // Disable editing mode after saving
  };

  return (
    <div className="container">
      <form>
        <input
          type="text"
          placeholder="Rechercher par ID"
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="button" className="btn btn-warning m-2" onClick={handleSearch}>Rechercher</button>
        <h2>Liste des publications</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? filteredPosts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={() => {
                      setFiltredPosts(filteredPosts.filter(item => item !== post));
                      setPosts(posts.filter(item => item.id !== post.id));
                    }}
                  >Supprimer</button>
                  <button
                    type="button"
                    className="btn btn-info m-2"
                    onClick={() => viewDetailPost(post.id)}
                  >Voir Détail</button>
                </td>
              </tr>
            )) : <tr><td colSpan={3} className="text-center fw-bold">Aucune publication</td></tr>}
          </tbody>
        </table>

        {isModalOpen && detailPost && (
          <div className="modale">
            <div className="modale-content">
              <span className="close-button" onClick={closeModal}>&times;</span>
              <label>ID :</label>
              <input type="text" className="form-control" readOnly value={detailPost.id} />
              <label>Titre :</label>
              <input
                type="text"
                className="form-control"
                name="title"
                readOnly={!isEditing}
                value={detailPost.title}
                onChange={handleEditChange}
              />
              <label>Body :</label>
              <textarea
                className="form-control"
                name="body"
                readOnly={!isEditing}
                value={detailPost.body}
                onChange={handleEditChange}
              />

              {isEditing ? (
                <div>
                  <button className="btn btn-success m-2" onClick={saveChanges}>Enregistrer</button>
                  <button className="btn btn-secondary m-2" onClick={closeModal}>Annuler</button>
                </div>
              ) : (
                <button className="btn btn-primary m-2" onClick={startEditing}>Modifier</button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
