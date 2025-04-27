import { useEffect, useState } from "react";
import axios from "axios";
import "./styple.css";
const API_URL = "http://localhost:5000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    const res = await axios.get(API_URL);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create item
  const createItem = async () => {
    if (name.trim() === "") return;
    await axios.post(API_URL, { name });
    setName("");
    fetchItems();
  };

  // Update item
  const updateItem = async () => {
    if (!editingItem || name.trim() === "") return;
    try {
      await axios.put(`${API_URL}/${editingItem.id}`, { name });
      setEditingItem(null);
      setName("");
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateItem();
    } else {
      createItem();
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setName(item.name);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple MERN CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Enter item"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">{editingItem ? "Update" : "Add"}</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            {item.name}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => startEditing(item)}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
