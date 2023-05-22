import { axiosPatch } from "./api";

export const patchApi = async ({
  cbSuccess,
  cbFailure,
  value,
  url,
  guarded = true,
}) => {
  try {
    const { data } = await axiosPatch({
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
