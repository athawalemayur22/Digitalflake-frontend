import food from '../assets/images/food.png'
import home from '../assets/images/home.png'
import map from '../assets/images/map.png'
import skyline from "../assets/images/skyline.png";
import style from './Sidebar.module.css'
import { NavLink } from 'react-router-dom';
function Sidebar() {
  return (
    
      <div className={style.sidebarContainer}>
        <ul>
          <li>
              <img src={home} alt="" />
              <NavLink to="/">
                Home
              </NavLink>
          </li>
          <li>
             
                <img src={map} alt="" />
              
            <NavLink to="/state">
              State
            </NavLink>
          </li>
          <li>
              <div>
                <img src={skyline} alt="" />
              </div>
            <NavLink to="/city">
              City
            </NavLink>
          </li>
          <li>
              <div>
                <img src={food} alt="" />
              </div>
            <NavLink to="warehouse">
              Warehouse
            </NavLink>
          </li>
        </ul>
      </div>
    
  );
}

export default Sidebar;
