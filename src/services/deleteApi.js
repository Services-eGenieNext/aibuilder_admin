import { axiosDelete } from "./api";

export const deleteApi = async ({
  cbSuccess,
  cbFailure,
  value,
  url,
  guarded = true,
}) => {
  try {
    const { data } = await axiosDelete({
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
