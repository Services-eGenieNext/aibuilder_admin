import React, { useState } from "react";
import { Card, Switch, Typography } from "antd";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";
import LikeSetting from "../../Components/LikeSetting";

const { Title } = Typography;

const Likes = () => {
  const [isReelEnabled, setIsReelEnabled] = useState(false);
  const [isStoryEnabled, setisStoryEnabled] = useState(false);
  const [isFeedEnabled, setIsFeedEnabled] = useState(false);
  const [isPostEnabled, setIsPostEnabled] = useState(false);

  const onSwitch = (value, type) => {
    switch (type) {
      case "reel":
        setIsReelEnabled(value);
        break;

      case "story":
        setisStoryEnabled(value);
        break;

      case "feed":
        setIsFeedEnabled(value);
        break;

      case "post":
        setIsPostEnabled(value);
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
          <Card title="Likes">
            <Title level={5}>
              Like Reels:{" "}
              <Switch
                checked={isReelEnabled}
                onChange={(value) => onSwitch(value, "reel")}
              />
            </Title>

            {isReelEnabled && (
              <>
                <hr />
                <LikeSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              Like Stories:{" "}
              <Switch
                checked={isStoryEnabled}
                onChange={(value) => onSwitch(value, "story")}
              />
            </Title>

            {isStoryEnabled && (
              <>
                <hr />
                <LikeSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              Like Feeds:{" "}
              <Switch
                checked={isFeedEnabled}
                onChange={(value) => onSwitch(value, "feed")}
              />
            </Title>

            {isFeedEnabled && (
              <>
                <hr />
                <LikeSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              Like Posts:{" "}
              <Switch
                checked={isPostEnabled}
                onChange={(value) => onSwitch(value, "post")}
              />
            </Title>

            {isPostEnabled && (
              <>
                <hr />
                <LikeSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}
          </Card>
        </WithAuth>
      </MainLayout>
    </>
  );
};

export default Likes;
