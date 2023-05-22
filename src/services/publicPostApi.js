import { axiosPost } from "./api";

export const publicPostApi = async ({ cbSuccess, cbFailure, value, url }) => {
  try {
    const { data } = await axiosPost({
      address: `/${url}/`,
      data: value,
    });
    cbSuccess(data);
  } catch (e) {
    cbFailure(e.message);
  }
};
