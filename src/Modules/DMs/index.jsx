import React, { useState } from "react";
import { Card, Switch, Typography } from "antd";
import MainLayout from "../../Layout/MainLayout";
import WithAuth from "../../Middleware/WithAuth";
import FollowSetting from "../../Components/FollowSetting";
import UnfollowSetting from "../../Components/UnfollowSetting";

const { Title } = Typography;

const DMs = () => {
  const [messageReceived, setMessageReceived] = useState(false);
  const [newFollower, setNewFollower] = useState(false);
  const [reactedOnStory, setReactedOnStory] = useState(false);
  const [peopleNotFollowingMe, setPeopleNotFollowingMe] = useState(false);

  const onSwitch = (value, type) => {
    switch (type) {
      case "mr":
        setMessageReceived(value);
        break;

      case "nf":
        setNewFollower(value);
        break;

      case "rs":
        setReactedOnStory(value);
        break;

      case "pnfm":
        setPeopleNotFollowingMe(value);
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
          <Card title="DM Settings">
            <Title level={5}>
              If new message received:{" "}
              <Switch
                checked={messageReceived}
                onChange={(value) => onSwitch(value, "mr")}
              />
            </Title>

            {messageReceived && (
              <>
                <hr />
                <FollowSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              If new follower added:{" "}
              <Switch
                checked={newFollower}
                onChange={(value) => onSwitch(value, "nf")}
              />
            </Title>

            {newFollower && (
              <>
                <hr />
                <UnfollowSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              If reacted on my story:{" "}
              <Switch
                checked={reactedOnStory}
                onChange={(value) => onSwitch(value, "rs")}
              />
            </Title>

            {reactedOnStory && (
              <>
                <hr />
                <UnfollowSetting onSaveSetting={onSaveSetting} />
                <hr />
              </>
            )}

            <Title level={5}>
              If people not following me:{" "}
              <Switch
                checked={peopleNotFollowingMe}
                onChange={(value) => onSwitch(value, "pnfm")}
              />
            </Title>

            {peopleNotFollowingMe && (
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

export default DMs;
