import { Typography } from '@mui/material';

export default function DimensionFieldLabel({ label }: { label: string }) {
  return (
    <Typography
    gutterBottom
    sx={{fontSize: "14px", fontWeight: "400", color: "#9E9E9E" }}
  >
    {label}
  </Typography>
  );
}
