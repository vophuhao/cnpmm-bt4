import React, { useEffect, useState } from "react";
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

  // filter states
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [promotion, setPromotion] = useState("");
  const [sortBy, setSortBy] = useState("");

  const PAGE_SIZE = 6;

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
      // Gọi API
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

      console.log("Response từ API:", res);

      // Lấy data đúng
      const newProducts = Array.isArray(res.data) ? res.data : res?.data?.data || [];
      const total = Number(res?.total || res?.data?.total) || 0;

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


  // Reset khi thay đổi filter
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

  // debounce search
  const handleSearchChange = debounce((e) => {
    setKeyword(e.target.value.trim());
  }, 400);

  const skeletonItems = Array.from({ length: PAGE_SIZE }, (_, i) => i);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sản phẩm</h2>

      {/* Search + Filter */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Input
            placeholder="Tìm sản phẩm..."
            allowClear
            style={{ width: 250 }}
            onChange={handleSearchChange}
          />
        </Col>

        <Col>
          <Select
            placeholder="Chọn danh mục"
            onChange={(value) => setCategory(value || "")}
            style={{ width: 200 }}
            allowClear
            value={category || undefined}
          >
            <Option value="">Tất cả</Option>
            <Option value="Điện thoại">Điện thoại</Option>
            <Option value="Laptop">Laptop</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Khuyến mãi"
            onChange={(value) => setPromotion(value || "")}
            style={{ width: 200 }}
            allowClear
            value={promotion || undefined}
          >
            <Option value="">Tất cả</Option>
            <Option value="on">Đang khuyến mãi</Option>
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Sắp xếp"
            onChange={(value) => setSortBy(value || "")}
            style={{ width: 200 }}
            allowClear
            value={sortBy || undefined}
          >
            <Option value="">Mặc định</Option>
            <Option value="price_asc">Giá tăng dần</Option>
            <Option value="price_desc">Giá giảm dần</Option>
            <Option value="discount_desc">Khuyến mãi nhiều</Option>
          </Select>
        </Col>
      </Row>

      {/* Lọc theo khoảng giá */}
      <Row style={{ marginBottom: 20 }}>
        <Col span={8}>
          <p>Khoảng giá:</p>
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
                      <Skeleton.Image
                        active
                        style={{ width: "100%", height: 150 }}
                      />
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
              <List.Item
                key={item._id || item.id || `${item.name}-${index}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: (index % PAGE_SIZE) * 0.05,
                  }}
                >
                  <Card
                    hoverable
                    style={{
                      maxHeight: 370, // cố định chiều cao tất cả card

                    }}
                    cover={
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{
                          height: 200,
                          width: "100%",
                          objectFit: "cover",

                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    }
                  >
                    <Card.Meta
                      title={item.name}
                      description={
                        <>
                          <p>{item.category}</p>
                          <p>Giá: {item.price?.toLocaleString()}đ</p>

                          {/* Hiển thị giảm giá */}
                          {item.discount > 0 && (
                            <p style={{ color: "red" }}>Giảm: {item.discount}%</p>
                          )}

                          {/* Hiển thị khuyến mãi nếu có */}
                          {item.promotion && item.promotion !== "" && (
                            <p style={{ color: "red" }}>Giam gia:{item.promotion}%</p>
                          )}
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
