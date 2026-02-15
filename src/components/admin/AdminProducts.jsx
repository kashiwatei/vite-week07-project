import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import Pagination from "../Pagination";
import ProductModal from "../ProductModal";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function AdminProducts() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common.Authorization = token;
    checkAdmin();
    productModalRef.current = new bootstrap.Modal("#productModal", {
      backdrop: "static",
      keyboard: false,
    });
  }, []);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      getProducts();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleModalInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setTempProduct((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

      if (
        value !== "" &&
        index === newImage.length - 1 &&
        newImage.length < 5
      ) {
        newImage.push("");
      }

      if (
        value === "" &&
        newImage.length > 1 &&
        newImage[newImage.length - 1] === ""
      ) {
        newImage.pop();
      }

      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];

      if (newImage.length < 5) {
        newImage.push("");
      } else {
        alert("已達圖片新增上限");
      }

      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTempProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleRemoveImage = () => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      // alert("取得產品失敗: " + error.response.data.message);
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: [...tempProduct.imagesUrl.filter((image) => image !== "")],
      },
    };

    try {
      const response = await axios[method](url, productData);
      dispatch(createAsyncMessage(response.data));
      getProducts();
      closeModal();
    } catch (error) {
      // alert("新增失敗: " + error.response.data.message);
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      getProducts();
      closeModal();
      dispatch(createAsyncMessage(response.data));
    } catch (error) {
      // alert("刪除失敗: " + error.response.data.message);
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const openModal = (type, product) => {
    setModalType(type);
    setTempProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show(); // 開啟 modal
  };

  const closeModal = () => {
    productModalRef.current.hide(); // 關閉 modal
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`);

      if (response.data.success) {
        document.cookie = `hexToken =; expires = ${new Date(0).toUTCString()}; path = /`;
        delete axios.defaults.headers.common.Authorization;
        navigate("/");
      }
    } catch (error) {
      dispatch(
        createAsyncMessage(error.response?.data || { message: "登出失敗" }),
      );
    }
  };

  return (
    <>
      <div className="container">
        <div className="text-end mt-4">
          <button
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td className="text-end">{product.origin_price}</td>
                  <td className="text-end">{product.price}</td>
                  <td>
                    {product.is_enabled ? (
                      <span className="text-success">啟用</span>
                    ) : (
                      <span>未啟用</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>
      {/* ProductModal */}
      <ProductModal
        productModalRef={productModalRef}
        modalType={modalType}
        tempProduct={tempProduct}
        handleModalInputChange={handleModalInputChange}
        handleModalImageChange={handleModalImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        closeModal={closeModal}
        uploadImage={uploadImage}
      />
    </>
  );
}

export default AdminProducts;
