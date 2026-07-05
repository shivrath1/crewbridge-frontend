import api from "../api";

export const getDocuments = () =>
    api.get("/documents/");

export const uploadDocument = (formData: FormData) =>
    api.post("/documents/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteDocument = (id: number) =>
    api.delete(`/documents/${id}/`);