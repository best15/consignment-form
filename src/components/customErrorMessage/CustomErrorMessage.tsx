import { Typography } from "@mui/material";

export default function CustomErrorMessage({ message }: { message: string }) {
  return (
    <Typography
      color="error"
      sx={{ fontSize: "12px", fontWeight: "400", italize: "true" }}
    >
      {message}
    </Typography>
  );
}
