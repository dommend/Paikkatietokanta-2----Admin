import http from "../http-common";

const getAll = () => {
  return http.get("/locations");
};

const get = id => {
  return http.get(`/locations/${id}`);
};

const create = data => {
  return http.post("/locations", data);
  
};

const upload = data => {
  return http.post("/locations/upload", data);
}

const update = (id, data) => {
  return http.put(`/locations/${id}`, data);
};

const remove = id => {
  return http.delete(`/locations/${id}`);
};

const findByTitle = title => {
  return http.get(`/locations?title=${title}`);
};

const findMarkedImportant = () => {
  return http.get(`/locations/markedImportant`);
}

// Tags

const getAllTags = () => {
  return http.get("/locations/tags");
};

const getTag = id => {
  return http.get(`/locations/tags/${id}`);
};

const findTag = id => {
  return http.get(`/locations/tags/name/${id}`);
};


const createTag = data => {
  return http.post("/locations/tags/create", data);
}

const addTagToPost = data => {
  return http.post("/locations/tag/addToArticle", data);
}

const removeTag = (id) => {
  return http.delete(`/locations/delete/tag/${id}`);
};

const removeTagFromArticle = (id, data) => {
return http.put(`/locations/delete/removetagfromarticle/${id}`, data);
};


const updateTag = (id, data) => {
  return http.put(`/locations/update/tag/${id}`, data);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  findByTitle,
  findMarkedImportant,
  upload,
  getAllTags,
  getTag,
  findTag,
  createTag,
  addTagToPost,
  removeTag,
  removeTagFromArticle,
  updateTag
};
