// HOC/withAuth.jsx
import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Layout, Menu } from "antd";
import { TeamOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";

const { Header, Content, Sider, Footer } = Layout;

const MainLayout = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const history = useHistory();

  // useEffect(() => {
  //   (async () => {
  //     postApi({
  //       cbSuccess: (response) => {
  //         dispatch({
  //           type: "USER",
  //           payload: response.user,
  //         });
  //       },
  //       cbFailure: (err) => {
  //         if (err?.status === 401) {
  //           logout(dispatch);
  //           history.push("/login");
  //         }
  //       },
  //       url: `get_profile`,
  //       value: null,
  //     });
  //   })();
  // }, []);

  localStorage.setItem("cached_route", history.location.pathname);
  const goto = (url) => {
    history.push(`/${url}`);
  };

  const logOut = () => {
    dispatch({
      type: "TOKEN",
      payload: null,
    });
    localStorage.clear();
    history.push(`/login`);
  };

  const menu = (
    <Menu>
      <Menu.Item>Profile</Menu.Item>
      <hr />
      <Menu.Item>Sign out</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout>
        <Header className="header">
          <div className="header-nav">
            <div className="logo" onClick={() => goto("dashboard")}>
              AI Admin
            </div>
          </div>
        </Header>
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="side-bar-user">
              <div>
                <img src="/assets/img/default-user-image.png" alt="user" />
              </div>
              <div className="sider-user-box">
                <div className="sider-user-name">{user?.name}</div>
                <div className="sider-user-logout" onClick={logOut}>
                  {t("Log Out")}
                </div>
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["01"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item
                key="01"
                onClick={() => goto("dashboard")}
                icon={<HomeOutlined />}
              >
                {t("Dashboard")}
              </Menu.Item>

              <Menu.Item
                key="02"
                onClick={() => goto("users")}
                icon={<HomeOutlined />}
              >
                users
              </Menu.Item>

              <Menu.Item
                key="03"
                onClick={() => goto("verticals")}
                icon={<HomeOutlined />}
              >
                verticals
              </Menu.Item>

              <Menu.Item
                key="04"
                onClick={() => goto("categories")}
                icon={<HomeOutlined />}
              >
                categories
              </Menu.Item>

              <Menu.Item
                key="05"
                onClick={() => goto("features")}
                icon={<HomeOutlined />}
              >
                features
              </Menu.Item>

              <Menu.Item
                key="06"
                onClick={() => goto("templates")}
                icon={<HomeOutlined />}
              >
                Templates
              </Menu.Item>

              <Menu.Item
                key="07"
                onClick={() => goto("phases")}
                icon={<HomeOutlined />}
              >
                Phases
              </Menu.Item>

              <Menu.Item
                key="08"
                onClick={() => goto("platforms")}
                icon={<HomeOutlined />}
              >
                Platforms
              </Menu.Item>

              <Menu.Item
                key="09"
                onClick={() => goto("addons")}
                icon={<HomeOutlined />}
              >
                Addons
              </Menu.Item>

              <Menu.Item
                key="10"
                onClick={() => goto("orders")}
                icon={<HomeOutlined />}
              >
                Orders
              </Menu.Item>

              <hr />

              <Menu.Item
                key="11"
                onClick={() => goto("settings")}
                icon={<SettingOutlined />}
              >
                Settings
              </Menu.Item>

              <hr />
            </Menu>
          </Sider>
          <Layout>
            <Content
              className="site-layout-background"
              style={{
                margin: 20,
                minHeight: "100vh",
              }}
            >
              {props.children}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              ©{moment().format("YYYY")}{" "}
              <span className="primary-text">AI Builder</span> All Rights
              Reserved.
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
