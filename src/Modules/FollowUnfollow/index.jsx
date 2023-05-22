import React, { useState } from "react";
import { Card, Switch, Typography } from "antd";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";
import FollowSetting from "../../Components/FollowSetting";
import UnfollowSetting from "../../Components/UnfollowSetting";

const { Title } = Typography;

const FollowUnfollow = () => {
  const [followEnabled, setFollowEnabled] = useState(false);
  const [unfollowEnabled, setUnfollowEnabled] = useState(false);

  const onSwitch = (value, type) => {
    switch (type) {
      case "follow":
        setFollowEnabled(value);
        break;

      case "unfollow":
        setUnfollowEnabled(value);
        break;

      default:
        break;
    }
  };

  const onSaveSetting = (values) => {};

  return (
    <>
      <MainLayout>
        <WithAuth>
          <Card title="Follow / Unfollow">
            <Title level={5}>
              Follow:{" "}
              <Switch
                checked={followEnabled}
                onChange={(value) => onSwitch(value, "follow")}
              />
            </Title>

            {followEnabled && (
              <>
                <hr />
                <FollowSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              Unfollow:{" "}
              <Switch
                checked={unfollowEnabled}
                onChange={(value) => onSwitch(value, "unfollow")}
              />
            </Title>

            {unfollowEnabled && (
              <>
                <hr />
                <UnfollowSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}
          </Card>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default FollowUnfollow;
