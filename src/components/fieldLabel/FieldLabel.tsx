import { Typography } from "@mui/material";

export default function FieldLabel({ label }: { label: string }) {
  return (
    <Typography
      gutterBottom
      sx={{ mt: 3, fontSize: "14px", fontWeight: "400", color: "#9E9E9E" }}
    >
      {label}
    </Typography>
  );
}
