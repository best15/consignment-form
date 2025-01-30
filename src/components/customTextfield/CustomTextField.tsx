import { TextField } from "@mui/material";
import {
  FieldValues,
  FieldPath,
  ControllerRenderProps,
} from "react-hook-form";

interface CustomTextFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  error: boolean;
  placeholder?: string;
}

export default function CustomTextField<T extends FieldValues>({
  field,
  error,
  placeholder
}: CustomTextFieldProps<T>) {
  return (
    <TextField
      {...field}
      size="small"
      type="number"
      placeholder={placeholder}
      sx={{
        width: "120px",
        "& .MuiInputBase-input": {
          fontSize: "14px",
        },
      }}
      error={error}
    />
  );
}
