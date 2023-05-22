import { axiosPut } from "./api";

export const putApi = async ({
  cbSuccess,
  cbFailure,
  value,
  url,
  guarded = true,
}) => {
  try {
    const { data } = await axiosPut({
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
