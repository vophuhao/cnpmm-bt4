// src/pages/ViewedProductsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, List, Spin, Button } from "antd";
import axios from "../components/util/axios.customize";
import {  useNavigate } from "react-router-dom";
export default function ViewedProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
useEffect(() => {
  const fetchViewedProducts = async () => {
    try {
      const res = await axios.get("/v1/api/user/viewed");
      setProducts(Array.isArray(res.products) ? res.products : []);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm đã xem:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  fetchViewedProducts();
}, []);


  if (loading) return <Spin tip="Đang tải..." style={{ marginTop: 50 }} />;

  if (!products || products.length === 0) return <p>Chưa có sản phẩm nào đã xem.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm đã xem</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={products}
        renderItem={(item,index) => (
         <List.Item key={item._id ? `product-${item._id}` : `index-${index}`}>
            <Card onClick={() => navigate(`/products/${item._id}`)}
              hoverable
              cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: "cover" }} />}
              actions={[
                
              ]}
            >
              <Card.Meta
                title={item.name}
                description={`${item.price?.toLocaleString()}đ`}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
