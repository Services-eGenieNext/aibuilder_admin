import { axiosGet } from "./api";

export const getApi = async ({
  cbSuccess,
  cbFailure,
  value,
  url,
  isQuery = false,
}) => {
  url = isQuery ? `/${url}` : `/${url}`;
  try {
    const { data } = await axiosGet({
      address: url,
      data: value,
    });
    cbSuccess(data);
  } catch (e) {
    cbFailure(e.response);
  }
};
