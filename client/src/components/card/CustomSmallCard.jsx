import React from "react";

const CustomSmallCard = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", width: 300 }}>
      <div style={{ width: "40px", height: "40px", marginRight: "10px" }}>
        <img
          src="https://images.pexels.com/photos/19859470/pexels-photo-19859470/free-photo-of-desk-setup.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="#"
        />
      </div>
      <div>
        <h3 style={{ margin: 0, fontWeight: "bold" }}>Card title</h3>
        <p style={{ margin: 0 }}>This is the description</p>
      </div>
    </div>
  );
};

export default CustomSmallCard;
