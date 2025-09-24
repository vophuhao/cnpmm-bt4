import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Button, message, Row, Col } from "antd";
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "../components/util/axios.customize";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ✅ Lấy sản phẩm + check liked
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/v1/api/products/${id}`);
        const p = res.product; // backend trả về sản phẩm
        setProduct(p);

        // Gọi API kiểm tra user đã like chưa
        try {
          const res = await axios.get(`/v1/api/products/${id}/liked`);
          setLiked(res.liked);
        } catch (e) {
          console.warn("Không kiểm tra được trạng thái like:", e);
        }

        // Lấy sản phẩm tương tự
        if (p?.category) {
          const relatedRes = await axios.get("/v1/api/products", {
            params: { category: p.category, limit: 4 },
          });
          const list = Array.isArray(relatedRes.data?.data)
            ? relatedRes.data.data
            : relatedRes.data;
          setRelatedProducts(list.filter((item) => item._id !== p._id));
        }
      } catch (err) {
        console.error("Lỗi fetch sản phẩm:", err);
        message.error("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Toggle like/unlike
  const handleLike = async () => {
    try {
      const res = await axios.post(`/v1/api/products/${id}/like`);
      setLiked(res.liked); // trạng thái mới
      setProduct(res.data); // cập nhật số favorites mới từ backend
      message.success(res.liked ? "Đã thích sản phẩm" : "Đã bỏ thích sản phẩm");
    } catch (err) {
      console.error("Lỗi toggle like:", err);
      message.error("Không thể thay đổi trạng thái yêu thích");
    }
  };



  const handleBuy = async() => {
    try {
      const res = await axios.post(`/v1/api/products/${id}/purchase`);
       setProduct(res.data);
      alert("mua hang thành công")
    } catch (err) {
      console.error("Lỗi toggle like:", err);
      alert("lỗi vui lòng thử lại")
    }
  };

  // ✅ Fix Spin warning
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
        <p style={{ marginTop: 10 }}>Đang tải...</p>
      </div>
    );

  if (!product) return <p>Sản phẩm không tồn tại</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <Card
        title={`${product.name} (${product.views} lượt xem)  đã bán ${product.purchases}  ` } 
        cover={
          <img
            alt={product.name}
            src={product.image}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        }
        actions={[
          <div onClick={handleLike} style={{ cursor: "pointer" }}>
            {liked ? (
              <HeartFilled style={{ color: "#ff4d4f", fontSize: 20 }} />
            ) : (
              <HeartOutlined style={{ fontSize: 20 }} />
            )}{" "}
            {product.favorites}
          </div>,
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleBuy}
            style={{ borderRadius: 8 }}
          >
            Mua ngay
          </Button>,
        ]}
      >
        <p>
          <strong>Danh mục:</strong> {product.category}
        </p>
        <p>
          <strong>Giá:</strong> {product.price?.toLocaleString()}đ
        </p>
        {product.promotion > 0 && (
          <p style={{ color: "#ff4d4f" }}>Khuyến mãi: {product.promotion}%</p>
        )}
        {product.description && (
          <p>
            <strong>Mô tả:</strong> {product.description}
          </p>
        )}
      </Card>

      {/* --- Sản phẩm tương tự --- */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>Sản phẩm tương tự</h3>
          <Row gutter={16}>
            {relatedProducts.map((item) => (
              <Col xs={24} sm={12} md={6} key={item._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.name}
                      src={item.image}
                      style={{
                        height: 180,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/products/${item._id}`)}
                    />
                  }
                >
                  <Card.Meta
                    title={item.name}
                    description={`${item.price?.toLocaleString()}đ`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
