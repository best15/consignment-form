import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
});

const mock = new AxiosMockAdapter(axiosInstance);

// Mock GET request
mock.onGet("/api/locations").reply(() => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        200,
        [
          "Perth",
          "Sydney",
          "Melbourne",
          "Brisbane",
          "Adelaide",
          "Darwin",
          "Hobart",
          "Canberra",
        ],
      ]);
    }, 1000)
  );
});

// Mock POST request
mock.onPost("/api/submit-consignment").reply((config) => {
  const consignmentData = JSON.parse(config.data);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!consignmentData.id) resolve([400, { message: "Missing id." }]);

      if (
        !consignmentData.source ||
        !consignmentData.destination ||
        !consignmentData.weight ||
        !consignmentData.units
      ) {
        resolve([400, { message: "Missing required fields." }]);
      } else {
        resolve([201, { ...consignmentData, id: Date.now() }]);
      }
    }, 2000);
  });
});

export const fetchLocations = async () => {
  try {
    const response = await axiosInstance.get("/api/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const submitConsignment = async (consignmentData: any) => {
  try {
    const response = await axiosInstance.post(
      "/api/submit-consignment",
      consignmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting consignment:", error);
    throw error;
  }
};
