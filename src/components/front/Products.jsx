import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert(error.message);
      }
    };
    getProducts();
  }, []);

  const handleView = async (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="container">
      <div className="row g-3">
        {products.map((product) => {
          return (
            <div className="col-md-4" key={product.id}>
              <div className="card">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                />
                <div className="card-body">
                  <span className="badge text-bg-secondary mb-2">
                    {product.category}
                  </span>
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.content}</p>
                  <p className="card-text">
                    <del>原價：{product.origin_price} 元</del>
                    <span className="ms-2">售價：{product.price} 元</span>
                  </p>
                  <div className="d-flex mt-auto">
                    <button type="button" className="btn btn-primary ms-auto" onClick={() => handleView(product.id)}>
                      查看更多
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
