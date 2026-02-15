import { Link, Outlet } from "react-router";

function AdminLayout() {
  return (
    <>
      <header>
        <ul className="nav mb-5 fs-5 justify-content-center">
          <li className="nav-item">
            <Link className="nav-link" to="/admin/products">
              後台產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">
              後台訂單列表
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

export default AdminLayout;
