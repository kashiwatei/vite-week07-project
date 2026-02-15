import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(res.data.data);
      } catch (error) {
        alert(error.message);
      }
    };
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const delCart = async (cartId) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
      alert("已成功刪除");
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteCartAll = async () => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
      alert("已成功清空購物車");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="container">
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={deleteCartAll}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => {
            return (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => delCart(cartItem.id)}
                  >
                    刪除
                  </button>
                </td>
                <th scope="row">{cartItem.product.title}</th>
                <td>
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="number"
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      defaultValue={cartItem.qty}
                      onChange={(e) =>
                        updateCart(
                          cartItem.id,
                          cartItem.product_id,
                          Number(e.target.value),
                        )
                      }
                    />
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {cartItem.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">{cartItem.final_total}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{cart.final_total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;
