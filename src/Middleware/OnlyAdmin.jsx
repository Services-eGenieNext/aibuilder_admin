// HOC/withAuth.jsx
import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const OnlyAdmin = (props) => {
  const user = useSelector((state) => state.app.user);

  if (user?.is_superuser) {
    return <>{props.children}</>;
  } else {
    return <Redirect to={"/dashboard"} />;
  }
};

export default OnlyAdmin;
