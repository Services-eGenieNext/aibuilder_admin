import { axiosPost } from "./api";

export const postApi = async ({
  cbSuccess,
  cbFailure,
  value,
  url,
  guarded = true,
}) => {
  try {
    const { data } = await axiosPost({
      address: `/${url}/`,
      data: value,
      guarded,
    });
    cbSuccess(data);
  } catch (e) {
    console.log("e", e.message);
    cbFailure(e.response);
  }
};
