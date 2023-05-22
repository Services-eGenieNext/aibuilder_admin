import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";

const Dashboard = () => {
  const { t } = useTranslation(["translations"]);
  return (
    <>
      <MainLayout>
        <WithAuth>
          <h1 style={{ textAlign: "center" }}>{t("welcome")}</h1>
          {/* <h1 style={{ textAlign: "center" }}>Welcome to the Dashboard</h1> */}
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Dashboard;
