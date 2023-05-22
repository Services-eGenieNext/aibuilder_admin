import React, { useEffect, Suspense } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

//Import components
import LoginScreen from "./Screens/Login";
import RegisterScreen from "./Screens/Register";
import ForgotScreen from "./Screens/Forgot";

import DashboardScreen from "./Screens/Dashboard";

import CommentsScreen from "./Screens/Comments";
import ConnectionScreen from "./Screens/Connection";
import DMsScreen from "./Screens/DMs";
import FollowUnfollowScreen from "./Screens/FollowUnfollow";
import LikesScreen from "./Screens/Likes";
import PostsScreen from "./Screens/Posts";

import Home from "./Screens/Home";
//import UsersScreen from "./Screens/Admin/Users";
import VerifyScreen from "./Screens/Verify";
import SettingsScreen from "./Screens/Settings";
import UserDetailScreen from "./Screens/Admin/UserDetail";

import AddonsScreen from "./Screens/Addons";
import CategoriesScreen from "./Screens/Categories";
import VerticalScreen from "./Screens/Verticals";
import FeaturesScreen from "./Screens/Features";
import OrdersScreen from "./Screens/Orders";
import PaymentMethodsScreen from "./Screens/PaymentMethods";
import PhasesScreen from "./Screens/Phases";
import PlatformsScreen from "./Screens/Platforms";
import TemplatesScreen from "./Screens/Templates";
import UsersScreen from "./Screens/Users";

const url = new URL(window.location.href);
const token = url.searchParams.get("t");

function App() {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      if (token == 0) {
        localStorage.removeItem("token");
      } else {
        dispatch({
          type: "TOKEN",
          payload: token,
        });
        localStorage.setItem("token", token);
      }
    }
  }, []);

  return (
    <>
      <Suspense fallback="Loading...">
        <Router>
          <AnimatePresence exitBeforeEnter initial={false}>
            <div>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={LoginScreen} />
                <Route path="/users" component={UsersScreen} />
                <Route path="/categories" component={CategoriesScreen} />
                <Route path="/verticals" component={VerticalScreen} />

                <Route path="/features" component={FeaturesScreen} />
                <Route path="/templates" component={TemplatesScreen} />
                <Route path="/phases" component={PhasesScreen} />
                <Route path="/platforms" component={PlatformsScreen} />
                <Route path="/addons" component={AddonsScreen} />
                <Route path="/orders" component={OrdersScreen} />
                <Route
                  path="/payment-methods"
                  component={PaymentMethodsScreen}
                />
                <Route path="/register" component={RegisterScreen} />
                <Route path="/verify/:code" component={VerifyScreen} />
                <Route path="/forgot/:code?" component={ForgotScreen} />
                <Route path="/dashboard" component={DashboardScreen} />
                <Route path="/likes" component={LikesScreen} />
                <Route path="/comments" component={CommentsScreen} />
                <Route
                  path="/follow-unfollow"
                  component={FollowUnfollowScreen}
                />
                <Route path="/posts" component={PostsScreen} />
                <Route path="/dms" component={DMsScreen} />
                <Route path="/instapp/auth" component={ConnectionScreen} />
                <Route path="/settings" component={SettingsScreen} />
                <Route path="/admin/users" component={UsersScreen} />
                <Route
                  path="/admin/user-detail/:paramId"
                  component={UserDetailScreen}
                />
              </Switch>
            </div>
          </AnimatePresence>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
