import {
  act,
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { afterEach, vi } from "vitest";
import FormComponent from "./FormComponent";
import { fetchLocations, submitConsignment } from "../../service/mockApi";

vi.mock("../../service/mockApi", () => ({
  fetchLocations: vi.fn().mockResolvedValue(["Perth", "Sydney", "Melbourne", ]),
  submitConsignment: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("FormComponent", () => {
  test("should show loader first and then all input fields", async () => {
    render(<FormComponent />);

    // Assert: Loader should be shown initially
    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    // Wait for fetchLocations to resolve and the component to update
    await waitFor(() => expect(fetchLocations).toHaveBeenCalledTimes(1));

    // Assert: All fields displayed after fetch
    expect(screen.queryByText(/source/i)).toBeInTheDocument();
    expect(screen.queryByText(/destination/i)).toBeInTheDocument();
    expect(screen.queryByText(/weight/i)).toBeInTheDocument();
    expect(screen.queryByText(/dimensions/i)).toBeInTheDocument();
    expect(screen.queryByText(/height/i)).toBeInTheDocument();
    expect(screen.queryByText(/depth/i)).toBeInTheDocument();
    expect(screen.queryByText(/units/i)).toBeInTheDocument();
  });

  test("should set locations in dropdown menu once fetched", async () => {
    render(<FormComponent />);

    // Assert: Loader should be shown initially
    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    // Wait for fetchLocations to resolve and the component to update
    await waitFor(() => expect(fetchLocations).toHaveBeenCalled());

    // location value shown in source and destination dropdown
    expect(screen.queryByText(/Perth/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sydney/i)).toBeInTheDocument();
  });

  test("should show validation error if entered weight is more than 1000", async () => {
    render(<FormComponent />);

    // Assert: Loader should be shown initially
    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Source/i)).toBeInTheDocument()
    );

    const weightInput = screen.getByPlaceholderText("Weight");

    // Input weight more than 1000
    fireEvent.change(weightInput, { target: { value: 1200 } });
    await act(async () => new Promise(setImmediate));

    // Assert: validation error should be shown
    expect(
      screen.queryByText(/Weight must be less than 1000/i)
    ).toBeInTheDocument();
  });

  test("should show validation error if entered width/height/depth is more than 12", async () => {
    render(<FormComponent />);

    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    // Wait for fetchLocations to resolve and the component to update
    await waitFor(() => expect(fetchLocations).toHaveBeenCalled());

    const input = screen.getByPlaceholderText("Width");

    // Input width more than 12
    fireEvent.change(input, { target: { value: 20 } });
    await act(async () => new Promise(setImmediate));

    expect(
      screen.queryByText(/Width must be less than 12/i)
    ).toBeInTheDocument();
  });

  test("should show validation error if entered width/height/depth is less than 0", async () => {
    render(<FormComponent />);

    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    // Wait for fetchLocations to resolve and the component to update
    await waitFor(() => expect(fetchLocations).toHaveBeenCalled());

    const input = screen.getByPlaceholderText("Height");

    // Input width less than 0
    fireEvent.change(input, { target: { value: -12 } });
    await act(async () => new Promise(setImmediate));

    expect(
      screen.queryByText(/Height must be more than 0/i)
    ).toBeInTheDocument();
  });

  test("should submit form sucessfully if all input are validated", async () => {
    render(<FormComponent />);

    expect(screen.getByText(/fetching locations/i)).toBeInTheDocument();

    // Wait for fetchLocations to resolve and the component to update
    await waitFor(() => expect(fetchLocations).toHaveBeenCalled());

    const weightInput = screen.getByPlaceholderText("Weight");
    fireEvent.change(weightInput, { target: { value: 80 } });
    await act(async () => new Promise(setImmediate));

    const widthInput = screen.getByPlaceholderText("Width");
    fireEvent.change(widthInput, { target: { value: 4 } });
    await act(async () => new Promise(setImmediate));

    const heightInput = screen.getByPlaceholderText("Height");
    fireEvent.change(heightInput, { target: { value: 4 } });
    await act(async () => new Promise(setImmediate));

    const depthInput = screen.getByPlaceholderText("Depth");
    fireEvent.change(depthInput, { target: { value: 2 } });
    await act(async () => new Promise(setImmediate));

    fireEvent.click(screen.getByText("Submit"));
    await act(async () => new Promise(setImmediate));

    await waitFor(() =>
      expect(submitConsignment).toHaveBeenCalledWith(
        expect.objectContaining({
          weight: "80",
          dimensions: {
            depth: "2",
            height: "4",
            width: "4",
          },
        })
      )
    );
  });
});
