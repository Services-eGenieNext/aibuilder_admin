import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom";
import { Card, Button, Row, Col } from "antd";
import LoginWithLinked from "../../Modules/Auth/SignInWithLinkedIn";
import { postRequest } from "../../redux/actions/API";
import LoginWithFacebook from "../../Modules/Auth/SignInWithFacebook";
import LoginWithGoogle from "../../Modules/Auth/SIgnInWithGoogle";
const Home = () => {
  const history = useHistory();
  const token = useSelector((state) => state.app.token);

  useEffect(() => {
    (async () => {
      let response = await postRequest("api", token);
    })();
  }, []);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row justify="center">
            <Col xs={24}>
              <Card>
                <Button type="primary" onClick={() => history.push("login")}>
                  Login
                </Button>
                <div style={{ marginTop: "10px" }}>
                  <LoginWithLinked />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <LoginWithFacebook />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <LoginWithGoogle />
                </div>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Home;
