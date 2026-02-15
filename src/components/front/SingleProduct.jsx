import { useParams } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        alert(error.message);
      }
    };
    handleView(id);
  }, [id]);

  const addCart = async (id, qty = 1) => {
    try {
        const data = {
            product_id: id,
            qty
        }
        const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`,{data});
        console.log(res.data);
        alert("已成功加入購物車");
    } catch (error) {
        alert(error.message);
    }
  }

  return !product ? (
    <h1>查無產品</h1>
  ) : (
    <div className="container">
      <div className="card" style={{ width: "18rem"}}>
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
          <p className="card-text bg-light p-3 rounded">
            {product.description}
          </p>
          <p className="card-text">
            <del>原價：{product.origin_price} 元</del>
            <span className="ms-2">售價：{product.price} 元</span>
          </p>
          <div className="d-flex mt-auto">
            <button
              type="button"
              className="btn btn-primary ms-auto"
              onClick={() => addCart(product.id)}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
