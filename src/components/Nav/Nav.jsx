import "../Nav/nav.scss";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { MdFavorite } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";

function Nav() {
  return (
    <ul className="nav">
      <Link to="/">
        <li className="nav__item">
          <HiHome />
          <span>Home</span>
        </li>
      </Link>
      <Link to="/favorites">
        <li className="nav__item">
          <MdFavorite />
          <span>Minha Lista</span>
        </li>
      </Link>
      <Link to="/account">
        <li className="nav__item">
          <RiAccountCircleFill />
          <span>Meu perfil</span>
        </li>
      </Link>
    </ul>
  );
}

export default Nav;
