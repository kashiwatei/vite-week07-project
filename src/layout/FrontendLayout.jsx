import { Link, Outlet } from "react-router";

function FrontendLayout() {
  return (
    <>
      <header>
        <ul className="nav mb-5 fs-5 justify-content-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              首頁
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products">
              產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              購物車列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              結帳
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              登入
            </Link>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-light">
        <p className="text-center mt-5 py-3 mb-0">六角學院 2026 課程作業</p>
      </footer>
    </>
  );
}

export default FrontendLayout;
