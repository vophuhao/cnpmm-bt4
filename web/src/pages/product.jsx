import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Card,
  Spin,
  Select,
  Skeleton,
  Input,
  Row,
  Col,
  Slider,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../components/util/axios.customize";
import { motion } from "framer-motion";
import { debounce } from "lodash";

const { Option } = Select;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [promotion, setPromotion] = useState("");
  const [sortBy, setSortBy] = useState("");

  const PAGE_SIZE = 6;
  const navigate = useNavigate();

  // Fetch sản phẩm
  const fetchProducts = async (
    pageNumber = 1,
    selectedCategory = category,
    searchKeyword = keyword,
    selectedPriceRange = priceRange,
    selectedPromotion = promotion,
    selectedSort = sortBy
  ) => {
    if (pageNumber === 1) setInitialLoading(true);
    setLoading(true);
    try {
      const res = await axios.get("/v1/api/products", {
        params: {
          page: pageNumber,
          limit: PAGE_SIZE,
          category: selectedCategory || "",
          search: searchKeyword || "",
          priceMin: selectedPriceRange[0],
          priceMax: selectedPriceRange[1],
          promotion: selectedPromotion || "",
          sortBy: selectedSort || "",
        },
      });

      const newProducts = Array.isArray(res.data) ? res.data : res?.data?.data || [];
      const total = Number(res?.total || res?.data?.total) || 0;
      console.log(res.data)
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
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, category, keyword, priceRange, promotion, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, keyword, priceRange, promotion, sortBy]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, category, keyword, priceRange, promotion, sortBy);
  };

  const handleSearchChange = debounce((e) => {
    setKeyword(e.target.value.trim());
  }, 400);

  const skeletonItems = Array.from({ length: PAGE_SIZE }, (_, i) => i);
  console.log(products)
  return (
    <div style={{ padding: 20, backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: 20 }}>Sản phẩm</h2>

      {/* Search + Filter */}
      <Card style={{ marginBottom: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="🔍 Tìm sản phẩm..."
              allowClear
              onChange={handleSearchChange}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Danh mục"
              onChange={(v) => setCategory(v || "")}
              value={category || undefined}
              style={{ width: "100%" }}
            >
              <Option value="">Tất cả</Option>
              <Option value="Điện thoại">Điện thoại</Option>
              <Option value="Laptop">Laptop</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Khuyến mãi"
              onChange={(v) => setPromotion(v || "")}
              value={promotion || undefined}
              style={{ width: "100%" }}
            >
              <Option value="">Tất cả</Option>
              <Option value="on">Đang khuyến mãi</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Sắp xếp"
              onChange={(v) => setSortBy(v || "")}
              value={sortBy || undefined}
              style={{ width: "100%" }}
            >
              <Option value="">Mặc định</Option>
              <Option value="price_asc">Giá tăng</Option>
              <Option value="price_desc">Giá giảm</Option>
              <Option value="discount_desc">Khuyến mãi nhiều</Option>
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col span={24} md={12}>
            <p style={{ marginBottom: 8 }}>Khoảng giá:</p>
            <Slider
              range
              min={0}
              max={100000000}
              step={500000}
              defaultValue={priceRange}
              onAfterChange={(value) => setPriceRange(value)}
            />
          </Col>
        </Row>
      </Card>

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
                    <Card style={{ borderRadius: 16 }}>
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
                    style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    cover={
                      <div style={{ position: "relative" }}>
                        {item.discount > 0 && (
                          <div style={{ position: "absolute", top: 10, left: 10, backgroundColor: "#ff4d4f", color: "#fff", padding: "2px 8px", borderRadius: 8, fontSize: 12, zIndex: 2 }}>
                            Giảm {item.discount}%
                          </div>
                        )}
                        <img
                          alt={item.name}
                          src={item.image}
                          style={{ height: 200, width: "100%", objectFit: "cover", cursor: "pointer" }}
                          onClick={() => {
                           
                            navigate(`/products/${item._id}`);
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<strong>{item.name}</strong>}
                      description={
                        <>
                          <p style={{ margin: 4, color: "#888" }}>{item.category}</p>
                          <p style={{ margin: 4, fontWeight: "bold" }}>{item.price?.toLocaleString()}đ</p>
                          {item.promotion && <p style={{ margin: 4, color: "#ff4d4f" }}>Khuyến mãi: {item.promotion}%</p>}
                        </>
                      }
                    />
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
