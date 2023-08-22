import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";

interface OrderDesign {
  imageUrl: string;
}

const OrderDesignComponent: React.FC = () => {
  const [certainOrderDesign, setCertainOrderDesign] =
    useState<OrderDesign | null>(null);
  const { order_id } = useParams<{ order_id: string }>();
  const { token } = useSelector((state: any) => state.user.userDetails);
  useEffect(() => {
    const url = `http://localhost:8000/order/${order_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<OrderDesign>(url, { headers }).then((response) => {
      setCertainOrderDesign(response.data);
    });
  }, [order_id]);
  if (!certainOrderDesign) return null;
  return (
    <div className="container">
        <center>
      <h2>Order Design</h2>
      </center>
      <img style={{maxHeight:"100%", maxWidth:"80%", objectFit:"contain"}} src={certainOrderDesign.imageUrl} alt="order design" />
    </div>
  );
};

export default OrderDesignComponent;
