import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import { useTheme } from "@mui/material/styles";
import {
  TextField,
  MenuItem,
  Select,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { Header } from "./styles";

import Loader from "../loader/Loader";
import Progress from "../progress/Progress";
import FieldLabel from "../fieldLabel/FieldLabel";
import CustomTextField from "../customTextfield/CustomTextField";
import CustomErrorMessage from "../customErrorMessage/CustomErrorMessage";
import DimensionFieldLabel from "../dimensionfieldLabel/DimensionFieldLabel";

import { generateId } from "../../utils";
import { fetchLocations, submitConsignment } from "../../service/mockApi";

interface formData {
  units: string;
  depth: number;
  width: number;
  weight: number;
  height: number;
  source: string;
  destination: string;
}

const FormComponent = () => {
  const theme = useTheme();
  const [locations, setLocations] = useState<string[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      source: "",
      destination: "",
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      units: "Centimeters",
    },
  });

  const convertDimensions = (unit: string, value: number) => {
    if (unit === "Millimeters") {
      return value * 10;
    } else {
      return value / 10;
    }
  };

  const onSubmit = async (data: formData) => {
    const payload = {
      id: generateId(),
      source: data.source,
      destination: data.destination,
      weight: data.weight,
      dimensions: {
        width: data.width,
        height: data.height,
        depth: data.depth,
      },
      units: data.units,
    };

    setIsSubmitting(true);

    try {
      const response = await submitConsignment(payload);
      reset();
      toast.success("Form submitted succesfully");
      console.log(response);
    } catch (error) {
      toast.error(`Error submitting form: ${error}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const width = watch("width");
    const height = watch("height");
    const depth = watch("depth");
    const units = watch("units");

    setValue("width", convertDimensions(units, width));
    setValue("height", convertDimensions(units, height));
    setValue("depth", convertDimensions(units, depth));
  }, [watch("units")]);

  useEffect(() => {
    const fetch = async () => {
      setFetching(true);
      try {
        const response = await fetchLocations();

        if (response.length > 0) {
          setValue("source", response[0]);
          setValue("destination", response[1]);
        }

        setLocations(response);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetch();
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxShadow: theme.shadows[2],
        borderRadius: "5px",
        backgroundColor: "#FFFFFF",
        height: "fit-content",
        minHeight: "500px",
        width: "720px",
        maxWidth: "720px",
        padding: theme.spacing(2),
        top: theme.spacing(1),
        [theme.breakpoints.down("md")]: {
          width: "90%",
          height: "fit-content",
        },
        [theme.breakpoints.down("sm")]: {
          maxWidth: "80%",
        },
      }}
    >
      {<Progress open={isSubmitting} />}
      <Header>
        <Typography variant="subtitle1">New consignment</Typography>
      </Header>
      {fetching && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            minHeight: "500px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader open={fetching} label="fetching locations ..." />
        </Box>
      )}
      {!fetching && locations.length > 0 && (
        <>
          <FieldLabel label="Source" />
          <Controller
            name="source"
            control={control}
            // defaultValue="Perth"
            rules={{
              required: "Source is required",
              validate: (value) =>
                value !== getValues().destination ||
                "Source and destination cannot be the same",
            }}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                sx={{ width: "250px", fontSize: "12px" }}
                error={!!errors.source}
              >
                {locations?.map((name: string) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.source && (
            <CustomErrorMessage
              message={
                typeof errors.source.message === "string"
                  ? errors.source.message
                  : "Error"
              }
            />
          )}
          <FieldLabel label="Destination" />
          <Controller
            name="destination"
            control={control}
            // defaultValue="Sydney"
            rules={{
              required: "Destination is required",
              validate: (value) =>
                value !== getValues().source ||
                "Source and destination cannot be the same",
            }}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                sx={{ width: "250px", fontSize: "12px" }}
                error={!!errors.destination}
                onChange={(e) => {
                  field.onChange(e);
                  trigger("source");
                }}
              >
                {locations?.map((name: string) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.destination && (
            <CustomErrorMessage
              message={
                typeof errors.destination.message === "string"
                  ? errors.destination.message
                  : "Error"
              }
            />
          )}
          <FieldLabel label="Weight" />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Controller
              name="weight"
              control={control}
              rules={{
                required: "Weight is required",
                min: { value: 1, message: "Weight must be more than 0" },
                max: { value: 1000, message: "Weight must be less than 1000" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  type="number"
                  placeholder="Weight"
                  sx={{
                    width: "250px",
                    fontSize: "12px",
                    marginRight: "4px",
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: "12px",
                    },
                  }}
                  error={!!errors.weight}
                  helperText={
                    typeof errors.weight?.message === "string"
                      ? errors.weight.message
                      : ""
                  }
                />
              )}
            />
            <DimensionFieldLabel label="Kg" />
          </Box>
          <FieldLabel label="Dimensions" />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: theme.spacing(2),
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "4px",
              },
            }}
          >
            <DimensionFieldLabel label="Width" />
            <Controller
              name="width"
              control={control}
              rules={{
                required: "Width is required",
                min: { value: 1, message: "Width must be more than 0" },
                max: { value: 12, message: "Width must be less than 12" },
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  error={!!errors.width}
                  placeholder="Width"
                />
              )}
            />
            <DimensionFieldLabel label="Height" />
            <Controller
              name="height"
              control={control}
              rules={{
                required: "Height is required",
                min: { value: 1, message: "Height must be more than 0" },
                max: { value: 12, message: "Height must be less than 12" },
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  error={!!errors.height}
                  placeholder="Height"
                />
              )}
            />
            <DimensionFieldLabel label="Depth" />
            <Controller
              name="depth"
              control={control}
              rules={{
                required: "Depth is required",
                min: { value: 1, message: "Depth must be more than 0" },
                max: { value: 12, message: "Depth must be less than 12" },
              }}
              render={({ field }) => (
                <CustomTextField
                  field={field}
                  error={!!errors.depth}
                  placeholder="Depth"
                />
              )}
            />
          </Box>
          <Box>
            {errors.width && (
              <CustomErrorMessage
                message={
                  typeof errors.width.message === "string"
                    ? errors.width.message
                    : "Error"
                }
              />
            )}
            {errors.height && (
              <CustomErrorMessage
                message={
                  typeof errors.height.message === "string"
                    ? errors.height.message
                    : "Error"
                }
              />
            )}
            {errors.depth && (
              <CustomErrorMessage
                message={
                  typeof errors.depth.message === "string"
                    ? errors.depth.message
                    : "Error"
                }
              />
            )}
          </Box>
          <FieldLabel label="Units" />
          <Controller
            name="units"
            control={control}
            rules={{
              required: "Units are required",
            }}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                sx={{ width: "250px", fontSize: "12px" }}
                error={!!errors.units}
              >
                <MenuItem key="Centimeters" value="Centimeters">
                  Centimeters
                </MenuItem>
                <MenuItem key="Millimeters" value="Millimeters">
                  Millimeters
                </MenuItem>
              </Select>
            )}
          />
          {errors.units && (
            <Typography color="error">{errors.units.message}</Typography>
          )}
          <Box
            sx={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, width: "120px", bgcolor: "#00A7FF" }}
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Submit
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FormComponent;
