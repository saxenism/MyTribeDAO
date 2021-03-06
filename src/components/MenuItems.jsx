import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/quickstart">
        <NavLink to="/quickstart">🚀 Store Token</NavLink>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet"> 📈 Equity</NavLink>
      </Menu.Item>
      <Menu.Item key="/createStore">
        <NavLink to="/createStore">🛍️ Store</NavLink>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <NavLink to="/erc20balance">💰 Claim Dividends</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
