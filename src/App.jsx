import {
  Routes,
  Route,
  NavLink,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./store.jsx";
import {
  Home,
  About,
  Services,
  Insights,
  Careers,
  Contact,
  Tools,
  SignIn,
  SignUp,
  Dashboard,
} from "./pages.jsx";
const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/services", "Services"],
  ["/insights", "Insights"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
];
function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: loc.pathname }} replace />
  );
}
function Nav() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="nav">
      <div className="wrap row">
        <Link to="/">
          <img
            src="/images/branding/logo-dark.png"
            height="44"
            alt="CrestPoint Advisory"
          />
        </Link>
        <ul>
          {links.map(([to, l]) => (
            <li key={to}>
              <NavLink to={to} end={to === "/"}>
                {l}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/tools">Tools</NavLink>
          </li>
        </ul>
        <div className="nr">
          {user ? (
            <>
              <Link className="btn o sm" to="/dashboard">
                Dashboard
              </Link>
              <button
                className="btn sm"
                onClick={() => {
                  signOut();
                  nav("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="btn o sm" to="/signin">
                Sign in
              </Link>
              <Link className="btn sm" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
const Footer = () => (
  <footer>
    <div className="wrap fgrid">
      <div>
        <img src="/images/branding/logo-light.png" height="44" alt="" />
        <p>Financial clarity. Strategic growth. Lasting prosperity.</p>
      </div>
      <div>
        <h4>Company</h4>
        <Link to="/about">About Us</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/insights">Insights</Link>
      </div>
      <div>
        <h4>Services</h4>
        <Link to="/services">Our services</Link>
        <Link to="/tools">Financial tools</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="mailto:hello@crestpointadvisory.com">
          hello@crestpointadvisory.com
        </a>
        <a href="tel:+2348000000000">+234 800 000 0000</a>
      </div>
    </div>
    <div className="wrap fb">© 2026 CrestPoint Advisory</div>
  </footer>
);
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
