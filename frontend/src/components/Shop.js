import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = ({ user }) => {
  const [items, setItems] = useState([
    { name: 'Sword', price: 100 },
    { name: 'Shield', price: 150 },
    { name: 'Potion', price: 50 },
  ]);

  const handlePurchase = async (item) => {
    if (user.bankAccount >= item.price) {
      try {
        await axios.post('http://localhost:5000/api/purchase', {
          username: user.username,
          item: item.name,
          quantity: 1,
          price: item.price,  // Include the price here
        });
        alert(`Purchase request sent for ${item.name}`);
      } catch (error) {
        console.error('Error sending purchase request:', error);
        alert('Failed to send purchase request.');
      }
    } else {
      alert('Not enough money!');
    }
  };
  

  return (
    <div>
      <h2>Shop</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
            <button onClick={() => handlePurchase(item)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shop;
