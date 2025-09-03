import React, { useEffect, useState } from "react";
import { List, Card, Spin, Select, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { motion } from "framer-motion";

const { Option } = Select;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [category, setCategory] = useState("");

  const PAGE_SIZE = 6;

  const fetchProducts = async (pageNumber = 1, selectedCategory = category) => {
    if (pageNumber === 1) setInitialLoading(true);
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8080/v1/api/products", {
        params: { page: pageNumber, limit: PAGE_SIZE, category: selectedCategory || "" },
      });

      const newProducts = Array.isArray(res?.data?.data) ? res.data.data : [];
      const total = Number(res?.data?.total) || 0;

      if (pageNumber === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(pageNumber * PAGE_SIZE < total);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    // mỗi lần đổi danh mục => reset list & tải lại trang 1
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, category);
  };

  const handleCategoryChange = (value) => {
    setCategory(value || "");
  };

  // mảng skeleton hợp lệ (0..5), KHÔNG dùng [...Array(6)]
  const skeletonItems = Array.from({ length: PAGE_SIZE }, (_, i) => i);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm</h2>

      <Select
        placeholder="Chọn danh mục"
        onChange={handleCategoryChange}
        style={{ width: 200, marginBottom: 20 }}
        allowClear
        value={category || undefined}
      >
        <Option value="Điện thoại">Điện thoại</Option>
        <Option value="Laptop">Laptop</Option>
        <Option value="Phụ kiện">Phụ kiện</Option>
      </Select>

      {/* Loading lần đầu */}
      {initialLoading ? (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: "center", padding: 10 }}>
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={skeletonItems}
                renderItem={(i) => (
                  <List.Item key={`skeleton-${i}`}>
                    <Card>
                      <Skeleton.Image active style={{ width: "100%", height: 150 }} />
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          }
          endMessage={<p style={{ textAlign: "center" }}>Hết sản phẩm</p>}
        >
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={products}
            renderItem={(item, index) => (
              <List.Item key={item._id || item.id || `${item.name}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % PAGE_SIZE) * 0.05 }}
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{ height: 200, width: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    }
                  >
                    <Card.Meta title={item.name} description={item.category} />
                  </Card>
                </motion.div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
