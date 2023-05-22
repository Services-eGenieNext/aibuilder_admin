import Axios from "axios";
import moment from "moment";

const API = Axios.create({
  baseURL: "https://builderapi.dfysaas.com",
  // baseURL: "http://localhost:3003",
});

const api = (endPoint, data) => {
  endPoint.data = data;
  switch (endPoint.type) {
    case "GET":
      return axiosGet(endPoint);
    case "POST":
      return axiosPost(endPoint);
    case "PATCH":
      return axiosPatch(endPoint);
    default:
      break;
  }
};

export default api;

export const axiosGet = async ({
  address: route,
  data,
  guarded: isGuarded,
}) => {
  await checkExpiry();
  try {
    const user_id = localStorage.getItem("token");
    return await API.get(
      route + (data ? data : ""),
      true
        ? {
            headers: {
              Authorization: "Bearer " + user_id,
            },
          }
        : null
    );
  } catch (error) {
    if (error.response.status == 401) {
      await checkExpiry(true);
      const user_id = localStorage.getItem("token");
      return await API.get(
        route + (data ? data : ""),
        true
          ? {
              headers: {
                Authorization: "Bearer " + user_id,
              },
            }
          : null
      );
    }
  }
};

export const axiosDelete = async ({
  address: route,
  data,
  guarded: isGuarded,
}) => {
  await checkExpiry();
  const user_id = localStorage.getItem("token");
  return await API.delete(route, {
    headers: {
      authorization: "Bearer " + user_id,
    },
  });
};

export const axiosPost = async ({
  address: route,
  data,
  guarded: isGuarded,
}) => {
  await checkExpiry();

  try {
    console.log("route : ", route);
    const user_id = localStorage.getItem("token");
    return await API.post(
      route,
      data,
      isGuarded
        ? {
            headers: {
              "content-type": "application/json",
              authorization: "Bearer " + user_id,
            },
          }
        : {
            headers: {
              "content-type": "application/json",
            },
          }
    );
  } catch (error) {
    if (error.response.status == 401) {
      await checkExpiry(true);
      const user_id = localStorage.getItem("token");
      return await API.post(
        route,
        data,
        isGuarded
          ? {
              headers: {
                "content-type": "application/json",
                authorization: "Bearer " + user_id,
              },
            }
          : {
              headers: {
                "content-type": "application/json",
              },
            }
      );
    } else {
      throw error;
    }
  }
};

export const axiosPatch = async ({
  address: route,
  data,
  guarded: isGuarded,
}) => {
  await checkExpiry();

  try {
    console.log("route : ", route);
    const user_id = localStorage.getItem("token");
    return await API.patch(
      route,
      data,
      isGuarded
        ? {
            headers: {
              "content-type": "application/json",
              authorization: "Bearer " + user_id,
            },
          }
        : {
            headers: {
              "content-type": "application/json",
            },
          }
    );
  } catch (error) {
    if (error.response.status == 401) {
      await checkExpiry(true);
      const user_id = localStorage.getItem("token");
      return await API.patch(
        route,
        data,
        isGuarded
          ? {
              headers: {
                "content-type": "application/json",
                authorization: "Bearer " + user_id,
              },
            }
          : {
              headers: {
                "content-type": "application/json",
              },
            }
      );
    } else {
      throw error;
    }
  }
};

export const axiosPut = async ({
  address: route,
  data,
  guarded: isGuarded,
}) => {
  await checkExpiry();
  const user_id = localStorage.getItem("token");
  return await API.put(
    route,
    data,
    isGuarded
      ? {
          headers: {
            authorization: "Bearer " + user_id,
          },
        }
      : {
          headers: {
            "content-type": "application/json",
          },
        }
  );
};

async function checkExpiry(getNew = false) {
  const expiryTime = localStorage.getItem("expiry_time");
  const isBefore = moment(moment(expiryTime)).isBefore(
    moment().format("YYYY-MM-DD h:mm:ss")
  );
  if (isBefore || getNew) {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const response = await API.post(
        "token/refresh/",
        {
          refresh: refreshToken,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.access);
      const expiry = moment().add(4, "minutes").format("YYYY-MM-DD h:mm:ss");
      localStorage.setItem("expiry_time", expiry);
      return true;
    } catch (error) {
      if (error.response?.status == 401) {
        return false;
      }
    }
  }
}
